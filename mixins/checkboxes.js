export default {
  data() {
    return {
      checkboxes: {
        kubz: [
          {
            model: 'have_read_regulations_on_kfd',
            label: `Я ознакомлен с`,
            linkTitle:
              'Положением о культурно-досуговом формировании КДФ «КЮБЗ»',
            link: require('@/assets/documents/kubz/regulations_of_kdf.pdf'),
          },
          {
            model: 'agree_with_internal_regulatoions',
            label: `Я ознакомлен и согласен с`,
            linkTitle: 'Правилами внутреннего распорядка КДФ «КЮБЗ»',
            link: require('@/assets/documents/kubz/inner_regulations.pdf'),
          },
          {
            model: 'agree_with_safety_regulations',
            label: `Я ознакомлен и согласен с`,
            linkTitle: 'Правилами техники безопасности участника КДФ «КЮБЗ»',
            link: require('@/assets/documents/kubz/safety_rules.pdf'),
          },
          {
            model: 'have_read_charter_of_kfd',
            label: `Я ознакомлен с`,
            linkTitle: 'Уставом КДФ «КЮБЗ»',
            link: require('@/assets/documents/kubz/charter_of_kdf.pdf'),
          },
        ],
        pony_club: [
          {
            model: 'have_read_regulations_on_kfd',
            label: `Я ознакомлен с`,
            linkTitle:
              'Положением о культурно-досуговом формировании КДФ «Пони клуб»',
            link: require('@/assets/documents/pony_club/regulations_of_kdf.pdf'),
          },
          {
            model: 'agree_with_internal_regulatoions',
            label: `Я ознакомлен и согласен с`,
            linkTitle: 'Правилами внутреннего распорядка КДФ «Пони клуб»',
            link: require('@/assets/documents/pony_club/internal_regulatoions.pdf'),
          },
          {
            model: 'agree_with_safety_regulations',
            label: `Я ознакомлен и согласен с`,
            linkTitle:
              'Правилами техники безопасности участника КДФ «Пони клуб»',
            link: require('@/assets/documents/pony_club/safety_regulations.pdf'),
          },
          {
            model: 'agree_with_entrance_tests_kfd',
            label: `Я ознакомлен и согласен с`,
            linkTitle: 'Вступительными испытаниями КДФ «Пони клуб»',
            link: require('@/assets/documents/pony_club/entrance_tests_kfd.pdf'),
          },
        ],
        kraski_mira: [
          {
            model: 'agree_with_rules',
            label: `Я ознакомлен и согласен с`,
            linkTitle: 'Правилами и положениями КДФ "Краски мира"',
          },
          {
            model: 'have_read_regulations_on_kfd',
            label: `Я ознакомлен с`,
            linkTitle:
              'Положением о культурно-досуговом формировании КДФ «Краски мира»',
          },
          {
            model: 'agree_with_internal_regulatoions',
            label: `Я ознакомлен и согласен с`,
            linkTitle: 'Правилами внутреннего распорядка КДФ «Краски мира»',
          },
          {
            model: 'agree_with_safety_regulations',
            label: `Я ознакомлен и согласен с`,
            linkTitle:
              'Правилами техники безопасности участника КДФ «Краски мира»',
          },
          // {
          //   model: 'agree_with_entrance_tests_kfd',
          //   label: `Я ознакомлен и согласен с`,
          //   linkTitle: 'Вступительными испытаниями КДФ «Краски мира»',
          // },
          {
            model: 'have_read_charter_of_kfd',
            label: `Я ознакомлен и согласен с`,
            linkTitle: 'Уставом КДФ «Краски мира»',
          },
        ],
      },
    }
  },
}
