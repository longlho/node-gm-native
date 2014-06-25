#include <Magick++.h>
#include <node.h>
#include <node_buffer.h>
#include <iostream>
#include <string.h>

using namespace v8;

#define THROW_EXCEPTION(msg) v8::ThrowException(String::New(msg)); scope.Close(Undefined());

static void resize(Magick::Image &image, std::string width, std::string height) {
  image.resize(width + 'x' + height);
}

static void fill(Magick::Image &image, std::string width, std::string height, Magick::GravityType gravity = Magick::NorthGravity) {
  std::string geometry = width + 'x' + height;
  image.resize(geometry + '^');
  image.extent(geometry, Magick::Color("transparent"), gravity);
}

static Magick::GravityType getGravityType(std::string gravity) {
  if (gravity == "CenterGravity")
    return Magick::CenterGravity;
  else if (gravity == "EastGravity")
    return Magick::EastGravity;
  else if (gravity == "ForgetGravity")
    return Magick::ForgetGravity;
  else if (gravity == "NorthEastGravity")
    return Magick::NorthEastGravity;
  else if (gravity == "NorthGravity")
    return Magick::NorthGravity;
  else if (gravity == "NorthWestGravity")
    return Magick::NorthWestGravity;
  else if (gravity == "SouthEastGravity")
    return Magick::SouthEastGravity;
  else if (gravity == "SouthGravity")
    return Magick::SouthGravity;
  else if (gravity == "SouthWestGravity")
    return Magick::SouthWestGravity;
  else if (gravity == "WestGravity")
    return Magick::WestGravity;
  else {
    return Magick::ForgetGravity;
  }
}

static std::string toString(Local<Value> str) {
  String::Utf8Value s(str->ToString());
  return std::string(*s);
}

Handle<Value> Montage(const Arguments& args) {
  HandleScope scope;
  return scope.Close(Undefined());
}

Handle<Value> Convert(const Arguments& args) {
  HandleScope scope;

  Handle<Object> opts;
  Local<Value> src;
  
  Magick::Blob blob;
  Magick::Image image;

  node::Buffer *output;

  MagickCore::SetMagickResourceLimit(MagickCore::ThreadResource, 1);

  if (args.Length() != 1 || !args[0]->IsObject()) {
    return THROW_EXCEPTION("Argument should be an object");
  }

  opts = Handle<Object>::Cast(args[0]);
  src = opts->Get(String::NewSymbol("src"));
  
  try {
    // src can be a file path, URL or a node::Buffer. Note that Magick++ path/URL fetching is blocking so don't use it
    if (src->IsString()) {
      // Convert src to std::string and throw into Magick
      image.read(toString(src));
    } else {
      // Create a Blob out of src buffer
      Magick::Blob inputBlob(node::Buffer::Data(src), node::Buffer::Length(src));
      image.read(inputBlob);
    }
  

  
    // Quality: 0 - 100
    unsigned int quality = opts->Get(String::NewSymbol("quality"))->Uint32Value();
    if (quality) {
      image.quality(quality);
    }

    // Supported format: http://www.imagemagick.org/script/formats.php
    Local<Value> format = opts->Get(String::NewSymbol("format"));
    if (format->IsString() && !format->IsUndefined()) {
      image.magick(toString(format));
    }

    // Operations, right now we support fill & resize
    std::string ops = toString(opts->Get(String::NewSymbol("ops")));

    // Width & height, strings are fine for Geometry
    std::string width = toString(opts->Get(String::NewSymbol("width")));
    std::string height = toString(opts->Get(String::NewSymbol("height")));

    if (ops == "resize") {
      resize(image, width, height);
    }
    else if (ops == "fill") {
      Local<Value> gravity = opts->Get(String::NewSymbol("gravity"));
      if (!gravity->IsUndefined()) {
        fill(image, width, height, getGravityType(toString(gravity)));
      } else {
        fill(image, width, height);
      }
      
    }
  
    // Write the image to a blob 
    image.write(&blob);

    output = node::Buffer::New(blob.length());
    memcpy(node::Buffer::Data(output->handle_), blob.data(), blob.length());

  } catch (const std::exception &err) {
    return THROW_EXCEPTION(err.what());
  } catch (...) {
    return THROW_EXCEPTION("Unexpected error");
  }

  return scope.Close(output->handle_);
}

void Init(Handle<Object> exports) {
  exports->Set(String::NewSymbol("convert"),
      FunctionTemplate::New(Convert)->GetFunction());

  exports->Set(String::NewSymbol("montage"),
      FunctionTemplate::New(Montage)->GetFunction());
}

NODE_MODULE(im_native, Init);
