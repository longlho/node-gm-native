{
  "targets": [
    {
      "target_name": "gm-native",
      "sources": [ "src/gm.cc" ],
      "cflags!": [ '-fno-exceptions' ],
      "cflags_cc!": [ '-fno-exceptions' ],
      "conditions": [
        [
          'OS=="mac"',
          {
            'xcode_settings': {
              'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
              'OTHER_CPLUSPLUSFLAGS' : [
                '<!@(GraphicsMagick++-config --cxxflags --cppflags)',
                '-std=c++11',
                '-stdlib=libc++',
              ],
              'OTHER_LDFLAGS': ['-stdlib=libc++'],
              'MACOSX_DEPLOYMENT_TARGET': '10.7',
              'LIBTOOLIZE': 'glibtoolize'
            },
            "libraries": [
              '-L/usr/local/lib',
              '<!@(GraphicsMagick++-config --ldflags --libs)',
            ],
            'cflags': [
              '<!@(GraphicsMagick++-config --cxxflags --cppflags)'
            ],
          }
        ],
        [
          'OS=="linux"',
          {
            "libraries": [
              '<!@(GraphicsMagick++-config --ldflags --libs)',
            ],
            'cflags': [
              '<!@(GraphicsMagick++-config --cflags --cppflags)'
            ],
          }
        ]
      ]
    }
  ]
}
