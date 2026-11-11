'use strict';

/* Java Lab v4.0 — fully specified first-block exercises and stricter completion rules. */

const V32_VERSION = '4.0';
const V32_ARCHIVED_IDS = new Set(['t1-swap', 't12-frequency']);

// The source course map mentions three control tasks, but the user's explicit platform requirement is exactly two tasks per lesson.
const v32ControlTitle = 'Контрольная блока: две новые задачи без подсказок';
for (const block of BLOCKS) {
  if (Array.isArray(block.lessons) && block.lessons.length >= 12 && block.id === 1) block.lessons[11] = v32ControlTitle;
  const controlRow = (block.lessonRows || []).find(row => row.id === 12);
  if (controlRow) controlRow.title = v32ControlTitle;
}

// Keep removed/merged exercises in the personal history instead of showing 3 tasks in a lesson.
state.archivedTaskHistory = state.archivedTaskHistory || [];
for (const legacyId of V32_ARCHIVED_IDS) {
  const legacyTask = TASKS.find(t => t.id === legacyId);
  if (legacyTask && !state.archivedTaskHistory.some(x => x.id === legacyId)) {
    state.archivedTaskHistory.push({
      id: legacyId,
      title: legacyTask.title,
      lesson: legacyTask.lesson,
      status: state.taskStatus[legacyId] || 'todo',
      attempts: (state.attempts || []).filter(a => a.taskId === legacyId),
      taskNote: state.taskNotes?.[legacyId] || '',
      draft: state.drafts?.[legacyId] || '',
      testRun: state.testRuns?.[legacyId] || null,
      hintCount: Number(state.hintCounts?.[legacyId]) || 0,
      review: state.reviewQueue?.[legacyId] || null,
      walkthroughSeen: state.walkthroughSeen?.[legacyId] || null,
      archivedDraft: state.archivedDrafts?.[legacyId] || '',
      archivedAt: new Date().toISOString(),
      note: 'Сохранено в исторических упражнениях при приведении блока к двум основным задачам на урок.'
    });
    // Once archived, a legacy reminder is preserved in the archive record instead of becoming an invisible active review.
    if (state.reviewQueue) delete state.reviewQueue[legacyId];
  }
}

// Every lesson in block 1 now has exactly two active, fully specified tasks.
for (let i = TASKS.length - 1; i >= 0; i--) {
  if (V32_ARCHIVED_IDS.has(TASKS[i].id)) TASKS.splice(i, 1);
}

function v32Walk(idea, steps, trace, pitfalls, solution) {
  return { idea, steps, trace, pitfalls, solution };
}
function v32SetTask(id, patch) {
  const task = TASKS.find(t => t.id === id);
  if (!task) throw new Error(`Java Lab v4.0: task not found: ${id}`);
  Object.assign(task, patch);
  task.difficulty = task.lesson === 12 ? 'Контрольная' : 'Базовая';
  if (task.lesson !== 12 && (!Array.isArray(task.hints) || task.hints.length !== 3)) {
    throw new Error(`Java Lab v4.0: task ${id} must have exactly three hints.`);
  }
  if (!task.starterCode || !Array.isArray(task.tests) || task.tests.length < 3 || !task.walkthrough?.solution) {
    throw new Error(`Java Lab v4.0: incomplete task ${id}.`);
  }
}

// Lesson 1, task 1. The original exercise title survives, but its exact old condition did not.
// This is an explicit, testable continuation exercise, not a claim that it reproduces the old prompt.
v32SetTask('t1-check', {
  description: 'Новая точная версия упражнения «Расчёт чека». Вводятся два целых неотрицательных числа: цена одной позиции в рублях и количество купленных позиций. Выведи общую стоимость покупки. Гарантируется, что произведение помещается в int.',
  starterCode: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int price = scanner.nextInt();\n        int quantity = scanner.nextInt();\n\n        // Вычисли общую стоимость и выведи её\n    }\n}`,
  tests: [
    { input: '120 3\n', expected: '360', label: 'Три позиции по 120 рублей' },
    { input: '75 2\n', expected: '150', label: 'Две позиции по 75 рублей' },
    { input: '0 4\n', expected: '0', label: 'Нулевая цена' },
    { input: '999 1\n', expected: '999', label: 'Одна позиция' }
  ],
  hints: [
    'В условии уже есть два входных значения. Подумай, какая арифметическая операция связывает цену одной позиции и количество.',
    'Заведи отдельную переменную total, чтобы имя отражало смысл результата.',
    'Общая стоимость равна price, умноженной на quantity. Выведи total через System.out.println.'
  ],
  walkthrough: v32Walk(
    'Чек в этой задаче состоит из одинаковых позиций. Если одна позиция стоит 120 рублей, а таких позиций три, общую стоимость можно получить сложением 120 + 120 + 120. Умножение — короткая запись такого повторяющегося сложения.',
    [
      'Считай цену одной позиции в переменную price.',
      'Считай количество в переменную quantity.',
      'Создай total и вычисли price * quantity.',
      'Выведи total. Отдельный цикл здесь не нужен: количество уже участвует в умножении.'
    ],
    [['price','quantity','Вычисление','total'],['120','3','120 * 3','360'],['75','2','75 * 2','150'],['0','4','0 * 4','0']],
    [
      'Сложить цену и количество вместо умножения.',
      'Перепутать порядок ввода и считать quantity как price.',
      'Вычислить total, но забыть вывести его.'
    ],
    `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int price = scanner.nextInt();\n        int quantity = scanner.nextInt();\n        int total = price * quantity;\n        System.out.println(total);\n    }\n}`
  )
});

// Lesson 1, task 2. Preserve the previous completion state of t1-balance.
v32SetTask('t1-balance', {
  description: 'Новая точная версия упражнения «Работа с балансом». Вводятся три целых числа: начальный баланс, сумма пополнения и сумма покупки. Выведи баланс после пополнения и покупки: начальный баланс + пополнение − покупка. В рамках задачи допускается отрицательный итоговый баланс.',
  starterCode: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int balance = scanner.nextInt();\n        int deposit = scanner.nextInt();\n        int purchase = scanner.nextInt();\n\n        // Обнови баланс и выведи результат\n    }\n}`,
  tests: [
    { input: '1000 500 300\n', expected: '1200', label: 'Пополнение и покупка' },
    { input: '0 200 50\n', expected: '150', label: 'Начальный баланс равен нулю' },
    { input: '100 0 150\n', expected: '-50', label: 'Покупка больше текущего баланса' },
    { input: '250 0 0\n', expected: '250', label: 'Нет операций' }
  ],
  hints: [
    'Проследи порядок операций: сначала деньги добавляются, потом сумма покупки вычитается.',
    'Можно изменить переменную balance двумя отдельными присваиваниями или одним выражением.',
    'Используй balance = balance + deposit - purchase, затем выведи balance.'
  ],
  walkthrough: v32Walk(
    'Переменная — это текущее значение, которое можно обновлять. Пополнение увеличивает баланс, а покупка уменьшает. Важно не потерять начальный баланс при вычислении нового значения.',
    [
      'Считай balance, deposit и purchase именно в том порядке, который указан в условии.',
      'Прибавь deposit к balance.',
      'Вычти purchase из получившегося значения.',
      'Сохрани результат обратно в balance и выведи его.'
    ],
    [['Операция','Баланс'],['Начальное значение','1000'],['Пополнение +500','1500'],['Покупка −300','1200'],['Итог','1200']],
    [
      'Начать вычисление с deposit и потерять начальный balance.',
      'Вычесть пополнение вместо покупки.',
      'Вывести старый balance до выполнения операций.'
    ],
    `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int balance = scanner.nextInt();\n        int deposit = scanner.nextInt();\n        int purchase = scanner.nextInt();\n        balance = balance + deposit - purchase;\n        System.out.println(balance);\n    }\n}`
  )
});

// Lesson 2, task 1: precise ATM branching with invalid, insufficient and successful outcomes.
v32SetTask('t2-atm', {
  description: 'Программа получает два целых числа: текущий баланс и сумму снятия. Если сумма снятия не положительная, выведи «Некорректная сумма». Если сумма больше баланса, выведи «Недостаточно средств». Иначе выведи две строки: «Выдано: X» и «Остаток: Y». Баланс неотрицательный.',
  starterCode: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int balance = scanner.nextInt();\n        int amount = scanner.nextInt();\n\n        // Реализуй проверки и вывод\n    }\n}`,
  tests: [
    { input: '5000 1200\n', expected: 'Выдано: 1200\nОстаток: 3800', label: 'Успешное снятие' },
    { input: '500 700\n', expected: 'Недостаточно средств', label: 'Недостаточно денег' },
    { input: '500 0\n', expected: 'Некорректная сумма', label: 'Нулевая сумма' },
    { input: '500 500\n', expected: 'Выдано: 500\nОстаток: 0', label: 'Снятие всего баланса' },
    { input: '500 -10\n', expected: 'Некорректная сумма', label: 'Отрицательная сумма' }
  ],
  hints: [
    'Здесь три возможных исхода: некорректная сумма, недостаточно денег, успешное снятие.',
    'Порядок проверок важен. Сначала проверь amount <= 0, затем amount > balance.',
    'В последней ветке вычисли balance - amount и выведи обе строки в точном формате.'
  ],
  walkthrough: v32Walk(
    'Банкомат сначала проверяет, можно ли выполнить запрос. Нельзя снимать ноль или отрицательную сумму. Если запрошено больше денег, чем есть, операция тоже невозможна. Только после этих двух проверок можно уменьшать баланс.',
    [
      'Считай balance и amount.',
      'Первым if проверь amount <= 0. Если это так, выведи сообщение и закончи ветвление.',
      'В else if проверь amount > balance. В этом случае денег не хватает.',
      'В последнем else операция допустима: выведи сумму выдачи и balance - amount.'
    ],
    [['Ввод','Первая проверка','Вторая проверка','Результат'],['5000 / 1200','false','false','Выдано 1200, остаток 3800'],['500 / 700','false','true','Недостаточно средств'],['500 / 0','true','не проверяется','Некорректная сумма']],
    [
      'Проверить amount > balance раньше amount <= 0 и получить не то сообщение для отрицательной суммы.',
      'Выполнить снятие до того, как проверено наличие денег.',
      'Забыть, что else if проверяется только если предыдущий if был ложным.'
    ],
    `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int balance = scanner.nextInt();\n        int amount = scanner.nextInt();\n        if (amount <= 0) {\n            System.out.println("Некорректная сумма");\n        } else if (amount > balance) {\n            System.out.println("Недостаточно средств");\n        } else {\n            System.out.println("Выдано: " + amount);\n            System.out.println("Остаток: " + (balance - amount));\n        }\n    }\n}`
  )
});

// Lesson 2, task 2: leap-year rule retained and given a complete I/O contract.
v32SetTask('t2-leap', {
  description: 'Введи одно целое число year — год по григорианскому календарю. Выведи «Високосный», если год делится на 400 или делится на 4, но не делится на 100. Во всех остальных случаях выведи «Обычный».',
  starterCode: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int year = scanner.nextInt();\n\n        // Составь логическое условие\n    }\n}`,
  tests: [
    { input: '2024\n', expected: 'Високосный', label: 'Обычный високосный год' },
    { input: '1900\n', expected: 'Обычный', label: 'Делится на 100, но не на 400' },
    { input: '2000\n', expected: 'Високосный', label: 'Делится на 400' },
    { input: '2023\n', expected: 'Обычный', label: 'Обычный год' },
    { input: '2400\n', expected: 'Високосный', label: 'Ещё одна проверка делимости на 400' }
  ],
  hints: [
    'Сначала вспомни исключение для столетних годов: делимость на 100 сама по себе не делает год високосным.',
    'Год високосный, если выполняется одно из двух условий: делится на 400; или делится на 4 и не делится на 100.',
    'Запиши логическое выражение с % и скобками: (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0).'
  ],
  walkthrough: v32Walk(
    'Год обычно високосный раз в четыре года. Но годы, которые заканчивают столетие (например, 1900), являются исключением. Исключение снимается, если год делится на 400 (например, 2000). Поэтому здесь нужно соединить две группы условий через логическое ИЛИ.',
    [
      'Проверь делимость на 400: остаток year % 400 должен быть равен нулю.',
      'Отдельно проверь делимость на 4 и неделимость на 100.',
      'Объедини группы через ||. Внутри второй группы используй &&.',
      'Если всё выражение true, выведи «Високосный», иначе — «Обычный».'
    ],
    [['Год','Делится на 400','Делится на 4','Делится на 100','Итог'],['2024','нет','да','нет','Високосный'],['1900','нет','да','да','Обычный'],['2000','да','да','да','Високосный']],
    [
      'Проверить только year % 4 == 0 и ошибочно назвать 1900 високосным.',
      'Использовать && между двумя большими группами вместо ||.',
      'Забыть скобки и получить выражение, которое сложно проверить глазами.'
    ],
    `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int year = scanner.nextInt();\n        boolean leap = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);\n        System.out.println(leap ? "Високосный" : "Обычный");\n    }\n}`
  )
});

// Lesson 3, task 1. Preserve the user's unresolved 505 rerun as a repeat item.
v32SetTask('t3-digits', {
  description: 'Введи неотрицательное целое число N и посчитай, сколько цифр 0 содержится в его десятичной записи. В рамках именно этого упражнения вход N = 0 даёт ответ 0 — так было принято в предыдущем разборе урока. Для положительного числа обрабатывай все цифры, включая нули внутри числа.',
  starterCode: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int n = scanner.nextInt();\n        int count = 0;\n\n        // Используй while и разбор числа на цифры\n    }\n}`,
  tests: [
    { input: '505\n', expected: '1', label: 'Один ноль посередине — важная перепроверка' },
    { input: '1000\n', expected: '3', label: 'Три нуля в конце' },
    { input: '10200\n', expected: '3', label: 'Ноль внутри и два в конце' },
    { input: '123\n', expected: '0', label: 'Нулей нет' },
    { input: '0\n', expected: '0', label: 'Принятая граница N = 0' }
  ],
  hints: [
    'Вспомни, что цикл должен обрабатывать одну последнюю цифру за итерацию, а затем уменьшать число.',
    'Последняя цифра получается через n % 10. Сравни её с нулём и увеличь count только при совпадении.',
    'После обработки выполни n = n / 10. Накопитель count должен быть объявлен до цикла while.'
  ],
  walkthrough: v32Walk(
    'Мы разбираем число справа налево. Для 505 сначала получаем последнюю цифру 5, затем после целочисленного деления остаётся 50. Его последняя цифра — 0, это одно совпадение. Затем остаётся 5, и цикл заканчивается. Значит, ответ равен 1.',
    [
      'Создай count = 0 до цикла: он будет хранить число найденных нулей.',
      'Пока n > 0, получай последнюю цифру через n % 10.',
      'Если digit == 0, увеличивай count на единицу.',
      'Убирай последнюю цифру: n = n / 10.',
      'После завершения цикла выведи count.'
    ],
    [['Итерация','n до','digit = n % 10','count после проверки','n после n / 10'],['1','505','5','0','50'],['2','50','0','1','5'],['3','5','5','1','0']],
    [
      'Забыть n = n / 10 и получить бесконечный цикл.',
      'Изменять n до того, как последняя цифра сохранена.',
      'Объявить count внутри while и терять накопленное значение.'
    ],
    `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int n = scanner.nextInt();\n        int count = 0;\n        while (n > 0) {\n            int digit = n % 10;\n            if (digit == 0) {\n                count++;\n            }\n            n = n / 10;\n        }\n        System.out.println(count);\n    }\n}`
  )
});

// Lesson 3, task 2. The original discussion retained boundary examples but not the full prompt;
// this is a clear reconstruction and is labelled as such in the task description.
v32SetTask('t3-debt', {
  description: 'Восстановленная однозначная версия старого упражнения «Погашение долга»: вводятся сумма долга и размер ежемесячного платежа (оба целые неотрицательные числа; платёж должен быть больше 0). Каждый месяц долг уменьшается на платёж, но не становится отрицательным: последний платёж может быть меньше обычного. Выведи количество месяцев до полного погашения. При долге 0 выведи 0.',
  starterCode: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int debt = scanner.nextInt();\n        int payment = scanner.nextInt();\n        int months = 0;\n\n        // Повторяй платежи, пока долг не закрыт\n    }\n}`,
  tests: [
    { input: '3000 3000\n', expected: '1', label: 'Платёж равен долгу' },
    { input: '3001 3000\n', expected: '2', label: 'После первого платежа остаётся 1' },
    { input: '10000 3000\n', expected: '4', label: 'Несколько одинаковых платежей' },
    { input: '0 3000\n', expected: '0', label: 'Долг уже закрыт' },
    { input: '10 3\n', expected: '4', label: 'Последний платёж меньше обычного' }
  ],
  hints: [
    'Подготовь до цикла две переменные: текущий остаток долга и количество месяцев.',
    'Каждая итерация означает один платёж. Сначала уменьши долг, затем увеличь счётчик месяцев.',
    'Чтобы долг не уходил в минус, после вычитания можно заменить отрицательный остаток на 0. Цикл продолжается, пока debt > 0.'
  ],
  walkthrough: v32Walk(
    'Представь долг 3001 и платёж 3000. После первого месяца остаётся 1 рубль. Во втором месяце последний платёж закрывает этот остаток, поэтому ответ — 2 месяца. Главное — считать каждый платёж отдельной итерацией и остановиться, когда остаток стал нулём.',
    [
      'Считай debt и payment. Платёж по условию должен быть положительным.',
      'Создай months = 0 до цикла.',
      'Пока debt > 0, уменьши debt на payment.',
      'Если после вычитания debt меньше 0, присвой ему 0: долг не может быть отрицательным.',
      'Увеличь months на 1. После цикла выведи months.'
    ],
    [['Месяц','Долг до платежа','Платёж','Долг после платежа'],['1','3001','3000','1'],['2','1','3000','0']],
    [
      'Не увеличивать months на последнем платеже.',
      'Продолжать цикл, когда debt уже равен нулю.',
      'Вычитать payment без ограничения и оставлять отрицательный долг.'
    ],
    `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int debt = scanner.nextInt();\n        int payment = scanner.nextInt();\n        int months = 0;\n        while (debt > 0) {\n            debt -= payment;\n            if (debt < 0) debt = 0;\n            months++;\n        }\n        System.out.println(months);\n    }\n}`
  )
});

// Keep the 505 task explicitly pending: the user has not confirmed the rerun in the old conversation.
if (state.taskStatus['t3-digits'] === 'done' && !state.testRuns['t3-digits']) {
  state.taskStatus['t3-digits'] = 'repeat';
  scheduleReview('t3-digits', 'Нужно подтвердить результат для 505: ожидается 1.');
}

// Lesson 12 is a two-task control, per the user's explicit platform requirement.
// The third old task remains archived in history and is not counted as an active exercise.
for (const controlId of ['t12-even-sum', 't12-palindrome']) {
  const task = TASKS.find(t => t.id === controlId);
  if (!task) throw new Error(`Missing control task ${controlId}`);
  task.hints = [
    'Сначала выпиши, какие значения нужно получить из входа и какие ограничения заданы. Вспомни похожую тему из уроков 5–6.',
    'Разбери маленький пример вручную. Отметь, что повторяется для каждого элемента или пары символов.',
    'Составь план из 3–5 шагов, а затем только переноси его в Java. После первой неудачной контрольной попытки можешь открыть этот уровень помощи.'
  ];
}

// Deeper, slower explanations: use plain Russian, concrete values, and explain why the syntax matters.
const V32_EXTRA_THEORY = {
  1: [
    ['Как Java вычисляет выражение', 'Сначала Java получает значения переменных, затем выполняет операции с учётом приоритета. У умножения и деления приоритет выше, чем у сложения и вычитания. Если сомневаешься, поставь скобки: (price + delivery) * quantity. Скобки не делают программу медленнее в заметном для этой задачи смысле, зато помогают человеку увидеть порядок вычислений.'],
    ['Присваивание — это обновление значения', 'Запись balance = balance + 100 означает: возьми старое значение balance, прибавь 100 и сохрани новый результат в ту же переменную. Правая часть вычисляется до присваивания. Это не математическое уравнение, где balance с двух сторон обязан быть одинаковым одновременно.'],
    ['Как выбрать тип на старте', 'Спроси себя: могут ли значения быть дробными? Если да, нужен double. Могут ли они быть больше примерно двух миллиардов? Тогда подумай о long. Должно ли значение быть только true/false? Используй boolean. Для текста — String. Не выбирай int просто потому, что его чаще всего показывают в примерах.']
  ],
  2: [
    ['Условие всегда должно давать true или false', 'Выражение balance >= price сравнивает два числа и возвращает boolean. Его можно записать в переменную: boolean enoughMoney = balance >= price; Тогда if (enoughMoney) читается почти как обычная фраза: «если денег достаточно». Это помогает не писать длинное и непонятное условие прямо внутри if.'],
    ['Почему ветки проверяются по порядку', 'Представь три скидки: от 5000 — 10%, от 2000 — 5%, иначе — 0%. Если поставить проверку «сумма >= 2000» первой, покупка на 6000 попадёт в неё и до условия 5000 программа уже не дойдёт. Сначала проверяй более строгие/частные условия, потом более общие.'],
    ['Короткое замыкание && и ||', 'В выражении A && B, если A уже false, Java не проверяет B: общий результат всё равно false. В A || B, если A уже true, Java не проверяет B: общий результат уже true. Это называют коротким замыканием. Не используй этот эффект как трюк; сначала добивайся, чтобы условие было понятно по смыслу.']
  ],
  3: [
    ['Из каких частей состоит while', 'У цикла while нет отдельного счётчика в заголовке. Есть условие продолжения и тело. До входа в цикл подготовь переменные. Внутри тела выполни один шаг и обязательно измени данные так, чтобы когда-нибудь условие стало false. Иначе цикл может никогда не закончиться.'],
    ['Один проход — одна обработанная цифра', 'В задаче 505 цикл не обрабатывает число целиком за один раз. Первый проход рассматривает только последнюю цифру 5, второй — цифру 0, третий — цифру 5. После каждого прохода рабочее число становится в десять раз меньше по целой части. Так мы постепенно «снимаем» цифры справа налево.'],
    ['Сначала проверь условие, затем тело', 'Если написать while (n > 0), то для n = 0 проверка false с самого начала и тело не выполнится ни разу. Это называется циклом с предусловием. В отличие от него do-while сначала выполняет тело хотя бы один раз, а затем проверяет условие. В этом блоке пока используем while, потому что для нулевого числа допускаем ноль проходов.']
  ],
  4: [
    ['Три части заголовка — три отдельных вопроса', 'В for (int i = 1; i <= n; i++) первая часть отвечает «с какого значения начать?», вторая — «пока какое условие повторять?», третья — «как изменить i после прохода?». Если мысленно произнести эти три вопроса, читать for становится проще.'],
    ['Почему вложенный цикл повторяет внутренний блок заново', 'Внешний цикл управляет строками, внутренний — действиями внутри одной строки. Когда внутренний цикл доходит до конца, он завершается. Затем внешний переходит к следующей строке и внутренний цикл запускается заново с начального значения своего счётчика.'],
    ['Как заранее посчитать число повторений', 'Если i начинается с 0 и работает при i < n, то будет n проходов: 0, 1, …, n - 1. Если i начинается с 1 и работает при i <= n, тоже будет n проходов: 1, 2, …, n. Сравнивай диапазон, а не только символы < и <=.']
  ],
  5: [
    ['String не хранит один символ, он хранит текст', 'В переменной String text = "Java" лежит последовательность символов. charAt(0) даст первый символ J, а charAt(3) — последний a. Когда задача говорит «проверь каждый символ», обычно нужен цикл по индексам, а внутри — charAt(i).'],
    ['Длина и последний индекс — не одно и то же', 'У строки "Java" длина 4, но индексы только 0, 1, 2, 3. Поэтому text.length() сообщает количество символов, а не номер последнего символа. Цикл i < text.length() не заходит на несуществующую позицию 4.'],
    ['Методы Character возвращают ответ, но не меняют счётчик', 'Character.isDigit(ch) отвечает только true или false. Он не считает цифры автоматически. Счётчик меняет твой код: if (Character.isDigit(ch)) { count++; }. Разделяй роли: метод проверяет символ, if выбирает действие, count хранит результат.']
  ],
  6: [
    ['Почему длина массива фиксирована', 'Когда создан массив new int[n], в нём ровно n ячеек. Нельзя добавить ещё одну ячейку через присваивание numbers[n] — такой индекс уже за границей. Если нужен список с изменяемым размером, позднее познакомимся с ArrayList. Сейчас важно уверенно понимать индексы массива.'],
    ['Как не ошибиться при поиске максимума', 'Для непустого массива положи в max первый реальный элемент. Затем начинай проверку со второго элемента. Если все числа отрицательные, начальное значение 0 испортило бы ответ, потому что 0 больше любого из них, хотя в массиве нуля нет.'],
    ['Обратный порядок не требует менять сам массив', 'Можно идти от последнего индекса к нулю и печатать элементы. Это обратный обход. Сам массив при этом не меняется. Перестановка элементов внутри массива — другая задача, для неё нужно менять элементы местами.']
  ],
  7: [
    ['Объявить метод и вызвать метод — разные действия', 'Объявление описывает, как метод работает: имя, параметры, тип результата и тело. Вызов запускает его с конкретными аргументами. Например, объявление int max(int a, int b) не вычисляет максимум само по себе; вычисление произойдёт, когда программа вызовет max(4, 9).'],
    ['return заканчивает выполнение метода', 'Когда Java доходит до return value, метод немедленно возвращает value вызывающему коду и завершает работу. Команды после return в той же ветке не выполняются. Если тип результата не void, на всех возможных путях метод должен вернуть значение подходящего типа.'],
    ['Почему маленькие методы помогают', 'Если main одновременно читает ввод, проверяет данные, считает ответ и форматирует вывод, его трудно читать и проверять. Можно выделить отдельный метод для вычисления максимума. Тогда он принимает числа и возвращает ответ, а main занимается вводом и выводом.']
  ],
  8: [
    ['nextInt и nextLine читают по-разному', 'nextInt() забирает следующий токен-число, но перевод строки после числа обычно остаётся во входном потоке. Поэтому следующий nextLine() может сразу прочитать пустую часть строки. После чтения числа иногда нужно отдельно забрать остаток строки через nextLine(), а затем прочитать нужный текст.'],
    ['switch выбирает один вариант', 'switch подходит, когда значение сравнивается с фиксированным набором вариантов: 1, 2, 3 или название enum. Ветка default обрабатывает всё, что не совпало. Не забывай break в классическом switch, чтобы выполнение не перетекало в следующую ветку.'],
    ['Ввод нужно проверять до вычисления', 'Если пользователь ввёл номер операции 8, нельзя молча считать его сложением или вычитанием. Сначала проверь, что операция поддерживается, и только потом выполняй её. Так программа предсказуемо реагирует на неправильный ввод.']
  ],
  9: [
    ['Три разных вида проблем', 'Ошибка компиляции означает, что код не соответствует правилам языка и программа не стартовала. Ошибка выполнения появляется уже во время работы, например при обращении за границу массива. Логическая ошибка означает, что программа запускается, но выдаёт неверный ответ. Для каждого случая нужен свой способ поиска причины.'],
    ['Stack trace — это маршрут к месту сбоя', 'В сообщении об исключении найди тип ошибки и первую строку, которая относится к твоему классу. Число после двоеточия обычно указывает номер строки. Сначала изучи место возникновения и значения переменных, а не пытайся переписать весь файл.'],
    ['Отладчик позволяет остановить программу', 'Поставь breakpoint на строке перед ошибкой, запусти Debug и выполняй программу шаг за шагом. Смотри значения переменных после каждой команды. Это похоже на таблицу ручного прогона, только значения показывает IDE.']
  ],
  10: [
    ['Проект — это несколько уже знакомых частей вместе', 'Игра «Угадай число» использует ввод, сравнение, цикл, счётчик попыток и условие остановки. Здесь не нужно искать новый сложный алгоритм. Важно правильно определить, что должно храниться между ходами: секретное число, количество попыток и флаг победы.'],
    ['Флаг хранит состояние', 'boolean guessed = false означает, что пока игрок не угадал число. Когда догадка совпала, программа меняет значение на true. После цикла можно проверить этот флаг и понять, чем закончилась игра. Флаг объявляют до цикла, чтобы он пережил все попытки.'],
    ['break завершает ближайший цикл', 'Если игрок угадал число на второй попытке, третью читать уже не нужно. break немедленно завершает ближайший цикл. После него программа продолжает работу с команды сразу после цикла.']
  ],
  11: [
    ['Анализ текста начинается с точного правила', 'Перед программированием реши, что считается цифрой, гласной или словом. Например, задача может считать только русские гласные или все Unicode-цифры. Разные правила дадут разные ответы. Поэтому условие должно точно описывать вход и критерий подсчёта.'],
    ['Нормализация упрощает сравнение', 'Если регистр не важен, можно привести текст к нижнему регистру. Если пробелы по краям не важны, можно вызвать trim(). Эти методы возвращают новую строку, поэтому сохраняй результат. Нормализация должна соответствовать условию: не удаляй символы, если пробелы имеют значение.'],
    ['Пустой текст — нормальный тест', 'Пустая строка не должна автоматически ломать анализатор. У неё длина 0, значит цикл перебора не выполнится. Для подсчёта слов нужно отдельно решить, что строка из пробелов содержит ноль слов, и обработать этот случай до split().']
  ],
  12: [
    ['Контрольная — это проверка переноса навыка', 'Задачи контрольной должны быть новыми, но решаться знакомыми инструментами. Не ищи готовый шаблон по названию. Используй привычный процесс: перескажи условие, отдели вход от выхода, сделай ручной прогон, опиши алгоритм и только затем кодируй.'],
    ['Первая попытка без подсказок', 'В контрольной первая попытка проходит без подсказок. Если тесты не прошли, можно открыть три уровня помощи и подробный разбор. Но для зачёта контрольной каждую задачу нужно затем решить заново с чистого листа и без подсказок.'],
    ['Тесты проверяют не только основной пример', 'Обычный тест показывает типичный ввод. Граничный тест проверяет минимальный размер, пустое значение или особое расположение элементов. Тест на отсутствие совпадений помогает увидеть, не выдал ли алгоритм ложный положительный результат.']
  ]
};
for (const [lessonId, extra] of Object.entries(V32_EXTRA_THEORY)) {
  const detail = LESSON_DETAILS[Number(lessonId)];
  if (detail) detail.theory.push(...extra);
}

// Add auto-graded comprehension checks for the first three lessons.
LESSON_DETAILS[1].quiz = [
  { q: 'Что хранится в переменной после выполнения int total = price * quantity;?', options: ['Исходная цена', 'Произведение цены и количества', 'Количество позиций плюс цена'], correct: 1, why: 'Оператор * умножает два значения, а результат присваивается переменной total.' },
  { q: 'Что выведет int result = 7 / 2; System.out.println(result);?', options: ['3', '3.5', '4'], correct: 0, why: 'Оба операнда имеют тип int, поэтому Java выполнит целочисленное деление и отбросит дробную часть.' },
  { q: 'Какой тип подходит для значения, которое может быть только true или false?', options: ['double', 'char', 'boolean'], correct: 2, why: 'boolean хранит два логических значения: true и false.' }
];
LESSON_DETAILS[2].quiz = [
  { q: 'Какое условие истинно, если balance равен 500, а payment равен 500?', options: ['balance > payment', 'balance >= payment', 'balance < payment'], correct: 1, why: '500 больше или равно 500, поэтому balance >= payment даёт true.' },
  { q: 'Что означает выражение age >= 18 && hasTicket?', options: ['Хотя бы одно условие истинно', 'Оба условия должны быть истинными', 'Оба условия должны быть ложными'], correct: 1, why: 'Оператор && — логическое И. Результат true только тогда, когда обе части true.' },
  { q: 'Почему проверку суммы >= 5000 обычно ставят перед суммой >= 2000?', options: ['Чтобы сначала проверить более высокий порог', 'Потому что Java не умеет проверять меньшие числа', 'Потому что else if всегда запускается первым'], correct: 0, why: 'При сумме 6000 условие >= 2000 тоже истинно. Если поставить его первым, до проверки 5000 программа не дойдёт.' }
];
LESSON_DETAILS[3].quiz = [
  { q: 'Для чего обычно создают count до цикла while?', options: ['Чтобы он сохранял накопленное значение между итерациями', 'Чтобы он автоматически завершал цикл', 'Чтобы переменная была доступна только внутри if'], correct: 0, why: 'Переменная объявленная до while, не обнуляется заново на каждом проходе.' },
  { q: 'Что вернёт 505 % 10?', options: ['50', '5', '0'], correct: 1, why: 'Остаток от деления на 10 равен последней цифре числа, то есть 5.' },
  { q: 'Что произойдёт с while (n > 0), если n изначально равен 0?', options: ['Тело выполнится один раз', 'Тело выполнится бесконечно', 'Тело не выполнится ни разу'], correct: 2, why: 'Условие 0 > 0 ложно уже до первого прохода цикла.' }
];

// The previous implementation presented three control tasks. The explicit product requirement is two.
// Keep only the sum-of-even-elements and palindrome task in the active control.
// The removed frequency exercise is preserved above in archivedTaskHistory.

// Verify and normalize every active task for lessons 1–12.
const V32_FIRST_BLOCK_TASKS = TASKS.filter(task => task.lesson >= 1 && task.lesson <= 12);
const V32_COUNTS = V32_FIRST_BLOCK_TASKS.reduce((map, task) => {
  map[task.lesson] = (map[task.lesson] || 0) + 1;
  return map;
}, {});
for (let lessonId = 1; lessonId <= 12; lessonId++) {
  if (V32_COUNTS[lessonId] !== 2) throw new Error(`Java Lab v4.0: lesson ${lessonId} has ${V32_COUNTS[lessonId] || 0} active tasks, expected 2.`);
  const lessonTasks = V32_FIRST_BLOCK_TASKS.filter(task => task.lesson === lessonId);
  for (const task of lessonTasks) {
    if (!task.starterCode || !Array.isArray(task.tests) || task.tests.length < 3 || !task.walkthrough?.solution) {
      throw new Error(`Java Lab v4.0: task ${task.id} lacks starter code, tests, or a worked solution.`);
    }
    if (task.lesson !== 12 && task.hints.length !== 3) throw new Error(`Java Lab v4.0: task ${task.id} must have exactly 3 hints.`);
    if (task.lesson === 12 && task.hints.length !== 3) throw new Error(`Java Lab v4.0: control task ${task.id} needs 3 post-attempt hints.`);
  }
}

// Make the lesson renderer use the same exact-two rule and preserve the no-hint first control attempt.
const v31OpenLesson = openLesson;
openLesson = function(id) {
  // Update the control lesson's explanation dynamically; retain all prior rendering and event wiring.
  if (id === 12) {
    TEACHING_GUIDE[12].plain = 'Контрольная состоит из двух задач. Первая попытка — без помощи, чтобы проверить самостоятельность. Если автоматические тесты не пройдут, появятся три уровня подсказок и пошаговый разбор. После просмотра разбора нужно вернуться через два дня и решить задачу с чистого листа без подсказок.';
  }
  v31OpenLesson(id);
};

// Strengthen the control lesson's no-hint-first-attempt rule at the task UI level.
const v31OpenTask = openTask;
openTask = function(taskId, options = {}) {
  const task = TASKS.find(t => t.id === taskId);
  if (!task) return;
  const isControlTask = task.lesson === 12;
  const beforeFirstAttempt = !state.testRuns?.[taskId];
  const first = v31OpenTask(taskId, options);
  // Any revealed hint changes the task from an independent pass to a task that must be repeated.
  // Capture phase runs before the original button handler re-renders the modal.
  const reveal = document.getElementById('reveal-hint');
  if (reveal && !reveal.dataset.v32HintGuard) {
    reveal.dataset.v32HintGuard = '1';
    reveal.addEventListener('click', () => {
      state.taskStatus[taskId] = 'hint';
      scheduleReview(taskId, 'Использована подсказка — вернись к задаче и реши её заново без помощи.');
      persist();
    }, true);
  }
  if (!isControlTask) return first;

  // The v3.1 renderer created the controls; adjust only the control-task gating and explanatory copy.
  const hintSection = reveal?.closest?.('.modal-section');
  const runButton = document.getElementById('run-task-tests');
  if (beforeFirstAttempt) {
    if (reveal) {
      reveal.disabled = true;
      reveal.textContent = 'Подсказки откроются после первой проверки';
    }
    if (hintSection) {
      const paragraph = hintSection.querySelector('p');
      if (paragraph) paragraph.textContent = 'Это контрольная: сначала выполни одну самостоятельную попытку и проверь её. После неудачной проверки станут доступны три уровня помощи.';
    }
    // The test runner is async. Watch for its saved result and unlock help only after a failed first attempt.
    if (runButton) runButton.addEventListener('click', () => {
      const previousAttemptCount = (state.attempts || []).length;
      let checks = 0;
      const poll = () => {
        checks++;
        const current = state.testRuns?.[taskId];
        if (current && (state.attempts || []).length > previousAttemptCount) {
          if (!current.allPassed && reveal) {
            reveal.disabled = false;
            reveal.textContent = 'Открыть первую подсказку';
            const p = hintSection?.querySelector?.('p');
            if (p) p.textContent = 'Первая попытка завершилась неудачно. Теперь можно открыть три уровня помощи и затем повторить задачу с чистого листа.';
          }
          return;
        }
        if (checks < 40) setTimeout(poll, 300);
      };
      setTimeout(poll, 300);
    });
  }
  return first;
};

// Completion is earned through tests + comprehension. The theory read itself never changes status.
canCompleteLesson = function(id) {
  if (id < 1 || id > 12) return false;
  const tasks = TASKS.filter(task => task.lesson === id);
  if (tasks.length !== 2) return false;
  const quiz = LESSON_DETAILS[id]?.quiz;
  const threshold = id === 12 ? 3 : 2;
  const score = Number(state.quizScores?.[id] ?? -1);
  if (!quiz || score < threshold) return false;
  const tasksPassed = tasks.every(task => {
    const status = state.taskStatus?.[task.id];
    const tests = state.testRuns?.[task.id];
    const cleanPass = !!tests?.allPassed && status === 'done';
    const noPendingReview = !state.reviewQueue?.[task.id];
    const controlWasClean = id !== 12 || ((Number(state.hintCounts?.[task.id]) || 0) === 0 && !state.walkthroughSeen?.[task.id]);
    return cleanPass && noPendingReview && controlWasClean;
  });
  return tasksPassed;
};

// Show the exact number of active tasks and their automated-test readiness on the practice page.
const v31RenderTaskCard = renderTaskCard;
renderTaskCard = function(task) {
  const html = v31RenderTaskCard(task);
  const count = task.tests?.length || 0;
  return html.replace('</h3>', '</h3>').replace('</p>', `</p><p class="small-muted">${count} автоматических теста · 3 уровня подсказок · пошаговый разбор</p>`);
};

// Add visible count and a historical exercises entry without adding them to the two-task curriculum.
const v31RenderPractice = renderPractice;
renderPractice = function() {
  let html = v31RenderPractice();
  const archived = state.archivedTaskHistory || [];
  if (archived.length) {
    const archiveHtml = `<section class="panel" style="margin-top:14px;grid-column:1/-1"><div class="panel-head"><div><h3>Исторические упражнения</h3><p>Ранее выполненные задания сохранены, но не входят в две основные задачи урока.</p></div><span class="tag">${archived.length}</span></div>${archived.map(item => `<div class="review-row"><div><strong>${escapeHtml(item.title)}</strong><small>Урок ${item.lesson} · ${taskStatusLabel(item.status)[1]} · ${item.attempts?.length||0} записей о попытках сохранено</small>${item.taskNote?`<p class="small-muted">Заметка: ${escapeHtml(item.taskNote)}</p>`:''}</div></div>`).join('')}</section>`;
    const insertAt = html.lastIndexOf('</div>');
    html = insertAt >= 0 ? `${html.slice(0, insertAt)}${archiveHtml}${html.slice(insertAt)}` : `${html}${archiveHtml}`;
  }
  return html;
};

// The control exercise description must not suggest a third visible problem.
TEACHING_GUIDE[12].worked = 'Первая попытка каждой из двух задач проходит без подсказок. После теста, который не прошёл, можно раскрыть подсказки и разбор. Сам разбор не засчитывается: через два дня нужно решить задачу снова с чистого черновика.';

// Persist migration metadata; do not reset completed lessons, drafts, notes, or previous attempts.
state.platformVersion = V32_VERSION;
state.archivedTaskHistory = state.archivedTaskHistory || [];
persist();
updateSidebarProgress();
renderView();

// Export v4.0 metadata while keeping the same localStorage key for seamless upgrades.
exportData = function() {
  const payload = { app: 'Java Lab', version: V32_VERSION, exportedAt: new Date().toISOString(), state };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url;
  link.download = `java-lab-backup-v${V32_VERSION}-${new Date().toISOString().slice(0,10)}.json`;
  link.click(); URL.revokeObjectURL(url);
};
