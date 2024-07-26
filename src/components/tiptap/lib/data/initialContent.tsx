export const initialContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: {
        textAlign: 'center',
        level: 1,
      },
      content: [
        {
          type: 'emoji',
          attrs: {
            name: 'sparkles',
          },
        },
        {
          type: 'text',
          text: 'Welcome to Moraa!',
        },
        {
          type: 'emoji',
          attrs: {
            name: 'rocket',
          },
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        class: 'intro',
        textAlign: 'center',
      },
      content: [
        {
          type: 'text',
          text: '🚀 Ready to elevate your content game? With Moraa, experience next-level AI-driven features that make writing effortless and fun. ✨ From smart suggestions to seamless collaboration, we’ve got everything you need to create stunning content! 🎉',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        textAlign: 'left',
        level: 2,
      },
      content: [
        {
          type: 'emoji',
          attrs: {
            name: 'star',
          },
        },
        {
          type: 'text',
          text: ' Key Features',
        },
        {
          type: 'emoji',
          attrs: {
            name: 'star',
          },
        },
      ],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: {
                class: 'feature-item',
                textAlign: 'left',
              },
              content: [
                {
                  type: 'text',
                  text: '💡 Smart AI Suggestions: Get personalized recommendations to enhance your writing flow.',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: {
                class: 'feature-item',
                textAlign: 'left',
              },
              content: [
                {
                  type: 'text',
                  text: '🤝 Seamless Collaboration: Collaborate in real-time with your team effortlessly.',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: {
                class: 'feature-item',
                textAlign: 'left',
              },
              content: [
                {
                  type: 'text',
                  text: '🎨 Customizable Templates: Choose and tailor templates to match your needs perfectly.',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: {
                class: 'feature-item',
                textAlign: 'left',
              },
              content: [
                {
                  type: 'text',
                  text: '🖋️ Enhanced Text Formatting: Access a rich set of formatting options to make your content pop.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        class: 'footer',
        textAlign: 'center',
      },
      content: [
        {
          type: 'text',
          text: '🌟 Transform your content creation journey with Moraa. Start now and witness the magic! ✨',
        },
      ],
    },
    {
      type: 'imageBlock',
      attrs: {
        src: '/logo-filled.svg',
        width: '100%',
        align: 'center',
      },
    },
  ],
}
