#include <Magick++.h>
#include <node.h>
#include <node_buffer.h>
#include <iostream>

using namespace v8;

Handle<Value> Convert(const Arguments& args) {
  HandleScope scope;

  if (args.Length() != 1 || !args[0]->IsObject()) {
    v8::ThrowException(Exception::TypeError(String::New("Argument should be an object")));
    return scope.Close(Undefined());
  }

  Handle<Object> opts = Handle<Object>::Cast(args[0]);

  Local<Value> src = opts->Get(String::NewSymbol("src"));

  Magick::Image image;
  Magick::Blob result;

  try {
    if (src->IsString()) {
      // Convert src to std::string and throw into Magick
      String::Utf8Value source(src->ToString());
      image.read(std::string(*source));
    } else {
      // Create a Blob out of src buffer
      Magick::Blob inputBlob(node::Buffer::Data(src), node::Buffer::Length(src));
      image.read(inputBlob);
    }

    // Crop the image to specified size (width, height, xOffset, yOffset)
    image.resize("100x100");
    image.magick("WEBP");

    // Write the image to a file 
    image.write(&result); 
  } catch( Magick::Exception &err_ ) { 
    v8::ThrowException(String::New(err_.what()));
    return scope.Close(Undefined());
  }

  node::Buffer *output = node::Buffer::New(result.length());
  memcpy(node::Buffer::Data(output->handle_), result.data(), result.length());

  return scope.Close(output->handle_);
}

void Init(Handle<Object> exports) {
  exports->Set(String::NewSymbol("convert"),
      FunctionTemplate::New(Convert)->GetFunction());
}

NODE_MODULE(im_native, Init);