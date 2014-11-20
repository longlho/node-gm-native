#include <Magick++.h>
#include <node_buffer.h>
#include <iostream>
#include <string.h>
#include "./convert.h"

using namespace v8;

static Magick::GravityType ToGravityType(std::string gravity) {
  if (gravity == "Center")         return Magick::CenterGravity;
  else if (gravity == "East")      return Magick::EastGravity;
  else if (gravity == "Forget")    return Magick::ForgetGravity;
  else if (gravity == "NorthEast") return Magick::NorthEastGravity;
  else if (gravity == "North")     return Magick::NorthGravity;
  else if (gravity == "NorthWest") return Magick::NorthWestGravity;
  else if (gravity == "SouthEast") return Magick::SouthEastGravity;
  else if (gravity == "South")     return Magick::SouthGravity;
  else if (gravity == "SouthWest") return Magick::SouthWestGravity;
  else if (gravity == "West")      return Magick::WestGravity;
  else {
    return Magick::ForgetGravity;
  }
}

static Magick::FilterTypes ToFilterType(std::string filter) {
  if (filter == "Point")          return Magick::PointFilter;
  else if (filter == "Box")       return Magick::BoxFilter;
  else if (filter == "Gaussian")  return Magick::GaussianFilter;
  else {
    return Magick::LanczosFilter;
  }
}

static Magick::InterlaceType ToInterlaceType(std::string interlace) {
  if (interlace == "Plane")           return Magick::PlaneInterlace;
  else if (interlace == "No")         return Magick::NoInterlace;
  else if (interlace == "Line")       return Magick::LineInterlace;
  else if (interlace == "Partition")  return Magick::PartitionInterlace;
  else {
    return Magick::UndefinedInterlace;
  }
}

static std::string ToString(Handle<Value> str) {
  return std::string(*NanUtf8String(str));
}

class ConvertWorker : public NanAsyncWorker {
public:
  ConvertWorker(std::string src, Handle<Array> options, NanCallback *callback) : NanAsyncWorker(callback), srcFilename(src) {
    this->Initialize(options);
  }

  ConvertWorker(Handle<Value> src, Handle<Array> options, NanCallback *callback) : NanAsyncWorker(callback), srcBlob(node::Buffer::Data(src), node::Buffer::Length(src)) {
    // Create a Blob out of src buffer
    this->Initialize(options);
  }

  ~ConvertWorker () {
    delete [] opts;
  }

  void Initialize (Handle<Array> options) {
    opts_length = options->Length();
    opts = new std::string[opts_length];
    for (unsigned int i = 0; i < options->Length(); ++i) {
      opts[i] = ToString(options->Get(i));
    }
  }

  // Executed inside the worker-thread.
  // It is not safe to access V8, or V8 data structures
  // here, so everything we need for input and output
  // should go on `this`.
  void Execute () {
    std::string method;
    std::string arg;
    Magick::GravityType gravity;
    Magick::InitializeMagick(NULL);

    try {
      if (!srcFilename.empty()) {
        image.read(srcFilename);
      } else {
        image.read(srcBlob);
      }

      for (unsigned int i = 0; i < opts_length; ++i) {
        method = opts[i];

        if (method == "strip")            image.strip();
        else if (method == "interlace")   image.interlaceType(ToInterlaceType(opts[++i]));
        else if (method == "quality")     image.quality(std::stoi(opts[++i]));
        else if (method == "format")      image.magick(opts[++i]);
        else if (method == "resize")      image.resize(opts[++i]);
        else if (method == "blurSigma")   image.blur(0, std::stoi(opts[++i]));
        else if (method == "filter")      image.filterType(ToFilterType(opts[++i]));
        else if (method == "extent") {
          gravity = ToGravityType(opts[i + 2]);
          // If there's no gravity
          if (gravity == Magick::ForgetGravity) {
            image.extent(opts[++i], Magick::Color("transparent"));
          }
          // If there is
          else {
            image.extent(opts[++i], Magick::Color("transparent"), gravity);
            i++;
          }
        }
      }
    } catch (const std::exception &err) {
      SetErrorMessage(err.what());
    } catch (...) {
      SetErrorMessage("Convert failed in im-native");
    }
  }

  void HandleOKCallback () {
    NanScope();
    Magick::Blob blob;
    image.write(&blob);

    Local<Value> argv[] = {
      NanNull(),
      NanNewBufferHandle((char *)blob.data(), blob.length())
    };

    callback->Call(2, argv);
  }
private:
  std::string srcFilename;
  Magick::Blob srcBlob;
  Magick::Image image;
  std::string *opts;
  unsigned int opts_length;
};


// Asynchronous access to the `Estimate()` function
NAN_METHOD(Convert) {
  NanScope();

  NanCallback *callback = new NanCallback(args[2].As<Function>());
  Handle<Array> opts =args[1].As<Array>();

  if (args[0]->IsString()) {
    NanAsyncQueueWorker(new ConvertWorker(ToString(args[0]), opts, callback));
  } else {
    NanAsyncQueueWorker(new ConvertWorker(args[0], opts, callback));
  }

  NanReturnUndefined();
}
