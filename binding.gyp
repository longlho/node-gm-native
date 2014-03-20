{
  "targets": [
    {
      "target_name": "im-native",
      "sources": [ "src/im.cc" ],
      "conditions": [
        [
          'OS=="mac"',
          {
            'xcode_settings': {
              'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
              'OTHER_CFLAGS': [
                '<!@(Magick++-config --cflags)'
              ],
              'OTHER_CPLUSPLUSFLAGS' : [
                '<!@(Magick++-config --cflags)',
                '-std=c++11',
                '-stdlib=libc++',
              ],
              'OTHER_LDFLAGS': ['-stdlib=libc++'],
              'MACOSX_DEPLOYMENT_TARGET': '10.7'
            },
            "libraries": [
               '<!@(Magick++-config --ldflags --libs)',
            ],
            'cflags': [
              '<!@(Magick++-config --cflags --cppflags)'
            ],
          }
        ], [
          'OS=="linux"',
          {
            "libraries": [
              '<!@(Magick++-config --ldflags --libs)',
            ],
            'cflags': [
              '<!@(Magick++-config --cflags --cppflags)'
            ],
          }
        ]
      ]
    }
  ]
}
