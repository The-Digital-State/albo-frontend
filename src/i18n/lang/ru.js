export default {
  Common: {
    login: 'Вход',
    logout: 'Выйти',
    gotIt: 'Понятно',
    copy: 'Скопировать',
    loading: 'Загрузка...',
    success: 'Успех',
    error: 'Ошибка',
    removeConfirmationTitle: 'Вы уверены?',
    removeConfirmationDescription: 'Вы не сможете отменить это!',
    removeConfirmationCancel: 'Нет, отменить!',
    removeConfirmationAccept: 'Да, удалить!',
    fillRequiredFields: 'Заполните все обязательные поля',
    copied: 'Скопировано в буфер обмена',
    noData: 'Нет данных',
  },

  TheHeader: {
    voting: 'Голосования',
    myVoting: 'Мои голосования',
    lists: 'Мои списки',
    panel: '@:DashboardPage.title',
  },

  TheFooter: {
    about: 'О проекте',
    feedback: 'Обратная связь',
    rules: 'Правила пользования',
    security: 'Безопасность',
    contacts: 'Контакты',
    authorization: 'Авторизация',
  },

  DateTimePicker: {
    cancel: 'Отмена',
    confirm: 'Ок',
  },

  Poll: {
    List: {
      title: 'Название',
      start: 'Начало голосования',
      end: 'Окончание голосования',
      emailsList: 'Список',
      status: 'Статус',
      draft: 'Черновик',
      published: 'Опубликовано',
      active: 'Активное голосование',
      finished: 'Завершено',
      edit: 'редактировать',
      remove: 'удалить',
    },

    Form: {
      infoTitle: 'Новое голосование',
      infoParagraph1: 'Поэтапно заполняйте форму голосования.',
      infoParagraph2: 'Как только все обязательные поля будут заполнены, вы сможете опубликовать голосование.',
      infoParagraph3: `Если у вас есть необходимость отвлечься от заполнения и вернуться позже,вы можете сохранить
      голосование в черновик.`,
      title: 'Название голосования',
      description: 'Описание',
      descriptionSubtitle: 'Описание и дата голосования',
      shortDescription: 'Краткое описание',
      shortDescriptionHint: 'Показывается в общем списке голосований',
      start: 'Дата и время начала',
      startHint: 'Пример {date}',
      end: 'Дата и время завершения',
      endHint: 'Пример {date}',
      dateHint: 'Голосование будет проходить по времени GMT+3 (Минск)',
      question: 'Вопрос',
      questions: 'Вопросы',
      questionsSubtitle: 'Вопрос и варианты голосования',
      option: 'Вариант {number}',
      optionAdd: 'Добавить вариант',
      settingsTitle: 'Настройки',
      settingsSubtitle: 'Тип голосования и условия',
      votingOnLists: 'Голосование по спискам',
      votingOnListsHint: 'Для ограниченного числа пользователей, которых вы указываете в списке',
      freeVoting: 'Свободное голосование',
      freeVotingHint: 'В голосовании могут участвовать все зарегистрированные пользовати сервиса',
      noList: 'Нет созданных списков',
      list: 'Список',
      chooseList: 'Выберите список',
      updateList: 'Обновить списки',
      newList: 'Новый список',
      listUserCount: '{count} человек|{count} человека',
      save: 'Сохранить черновик',
      saveHint: '<TBD>',
      lastSave: 'Последнее сохранние:',
      instructions: 'Инструкции',
      instructionsHint: '<TBD>',
      publish: 'Опубликуйте голосование',
      published: 'Голосование опубликованно',
      publishedAt: 'Дата публикации: {date}',
      publication: 'Публикация',
      publicationAllowed: 'Вы можете опубликовать голосование',
      remove: 'Удалить голосование',
      disabledRemove: 'Голосование уже опубликовано',
      fillRequirements: 'Заполните все необходимые поля',
      publishBtn: 'Опубликовать Голосование',
      whatNext: 'Что делать дальше?',
      whatNextDescription: ` Вы опубликовали голосование на платформе «Альбо». В ближайшее время на электронную почту
      участникам голосования будут разосланы письма с приглашениями принять участие в голосовании.
      Ссылку на голосование:`,
    },

    Options: {
      option: 'Вариант {number}',
      statisticByChoice: '0 человек | {n} человек | {n} человека | {n} человек',
    },
  },

  EmailsList: {
    List: {
      title: 'Название',
      description: 'Информация',
      emailsCount: '{count} человек | {count} человека',
      edit: 'редактировать',
      remove: 'удалить',
    },

    Form: {
      title: 'Название списка',
      emails: 'Email-ы голосующих',
      list: 'Список голосующих',
      inputEmails: 'Введите email-ы',
      inputEmailsHint: `Можно добавлять сразу несколько. Email’ы должны быть отделены между собой пробелом
      или запятой.`,
      add: 'Добавить',
      saveList: 'Сохранить список',
      search: 'Поиск',
      lastSaved: 'Последнее сохранние: {date}',
      deleteList: 'Удалить список',
      noVotersAdded: 'Вы ещё не добавили ни одного голосующего',
      count: 'Email адресов: {count}',
      remove: 'Удалить список',
    },
  },

  PollResult: {
    List: {
      token: 'Токен',
      choice: 'Вариант ответа',
      search: 'Поиск по токену',
      showMore: 'Показать еще',
    },
  },

  CountDownTimer: {
    labelToStart: 'До начала',
    labelToEnd: 'До окончания',
    days: '0 дней | {n} день | {n} дня | {n} дней',
    hours: '0 часов | {n} час | {n} часа | {n} часов',
    minutes: '0 минут | {n} минута | {n} минуты | {n} минут',
    seconds: '0 секунд | {n} секунда | {n} секунды | {n} секунд',
  },

  // Pages
  LoginPage: {
    azureSignIn: 'Sign in with Microsoft',
    authorization: 'Авторизация',
  },

  DashboardPage: {
    title: 'Панель',
    voting: 'Голосования',
    lists: 'Мои списки',
    addPoll: '+ Новое голосование',
    addEmailsList: '+ Добавить список',
    pollRemoved: 'Голосование удаленно',
    emailsListRemoved: 'Email список удален',
  },

  PollCreatePage: {
    title: 'Новое голосование',
    created: 'Голосование создано',
  },

  PollEditPage: {
    title: 'Голосование "{title}"',
    updated: 'Голосование обновлено',
    published: 'Голосование опубликовано',
    removed: 'Голосование удаленно',
  },

  EmailsListCreatePage: {
    title: 'Новый список',
    created: 'Список создан',
  },

  EmailsListEditPage: {
    title: 'Список голосующих "{title}"',
    updated: 'Список голосующих обновлен',
    removed: 'Список голосующих удален',
  },

  PollPreviewPage: {
    title: 'Голосование "{title}"',
    start: 'Начало голосования',
    end: 'Конец голосования',
    description: 'Описание',
    condition: 'Условия',
    conditionDescription: `В голосовании могут принять участие лица, включенные автором в список голосующих,
    для которых автоматически сгенерирована и выслана системой на электронную почту ссылка-приглашение. Не передавайте
    другим лицам свою ссылку-приглашение, иначе Вы утратите возможность лично проголосовать, как только другое лицо
    воспользуется вашей ссылкой-приглашением. Голосование тайное, Ваш выбор известен только Вам. В процессе выбора Вы
    можете выбрать либо один, либо несколько вариантов ответа на вопрос в зависимости от типа голосования,
    созданного автором.`,
    results: 'Результаты',
    voting: 'Голосование',
    weNeedYourVote: 'Нам нужен ваш голос',
    signIn: 'Чтобы участвовать в голосовании, авторизируйтесь одним из предложенных способов:',
    signInMicrosoft: 'Войти через Microsoft',
    resultsAfterFinished: 'Результаты голосования будут досупны после его завершения.',
    votingWillStartSoon: 'Голосование скоро начнется',
    votingInProcess: 'В процессе голования',
    votingFinished: 'Голование завершенно',
    timeToEnd: 'До окончания голосования',
    timeToStart: 'До начала голосования',
    vote: 'Голосовать',
    yourAreNotInvited: `Это голосование по спискам. Вы не сможете проголосовать, но вы сможете посмотреть результаты
    по его завершении.`,
    voted: 'Спасибо, вы уже проголосвали.',
    statistic: 'Статистика',
    statisticVoted: 'Проголосовало человек',
    statisticAll: 'Всего',
    statisticNotVoted: 'Не участвовали',
    statisticAfterFinished: 'Статистика будет досупна после окончания голосования.',
    historyResults: 'История голосования',
    historyResultsAfterFinished: '  Список будет досупен после окончания голосования.',
  },

  PollVotePage: {
    title: 'Голосование "{title}"',
    cannotChangeChoice: 'Вы не сможете изменить свой выбор после голосования.',
    variant: 'Вариант {n}',
    chooseVariant: 'Выберите один из вараинтов',
    choiceHeader: 'Ваш выбор:',
    choice: 'Вы выбрали <span>Вариант {n}</span>: {choice}',
    makeChoice: 'Сделать выбор',
    thanks: 'Спасибо',
    successfullyVote: 'Вы успешно оставили свой голос',
    howCheckMyVoice: 'Как проверить учтён ли мой голос?',
    howCheckMyVoiceDescription: `"Альбо" сгенерирован Вам уникальный ключ, при помощи которого после завершения
    голосования на вкладке "Результаты" можно будет проверить, как учтен Ваш голос:`,
    attention: 'Внимание!',
    attentionDescription: `Для обеспечения тайны голосования не передавайте Ваш ключ третьим лицам.
    Не теряйте ключ, в этом случае Вы не сможете проверить, как учтён Ваш голос.`,
    backToPoll: 'Вернуться к голосованию',
  },
};
