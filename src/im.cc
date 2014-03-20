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

  if (!src->IsString()) {
    v8::ThrowException(Exception::TypeError(String::New("src must be a string")));
    return scope.Close(Undefined());
  }
  
  Magick::Image image;
  Magick::Blob blob;
  try {
    String::Utf8Value source(src->ToString());
    // Read a file into image object 
    image.read(std::string(*source));

    // Crop the image to specified size (width, height, xOffset, yOffset)
    image.resize("100x100");
    image.magick("WEBP");

    // Write the image to a file 
    image.write(&blob); 
  } catch( Magick::Exception &err_ ) { 
    v8::ThrowException(String::New(err_.what()));
    return scope.Close(Undefined());
  }

  node::Buffer *output = node::Buffer::New(blob.length());
  memcpy(node::Buffer::Data(output->handle_), blob.data(), blob.length());

  return scope.Close(output->handle_);
}

void Init(Handle<Object> exports) {
  exports->Set(String::NewSymbol("convert"),
      FunctionTemplate::New(Convert)->GetFunction());
}

NODE_MODULE(im_native, Init);