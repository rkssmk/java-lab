'use strict';

const STORAGE_KEY = 'java-lab-progress-v1';

const BLOCKS = [
  {
    id: 1, title: 'Java-база: учимся начинать задачу', weeks: '1–6', lessons: [
      'Переменные, типы данных, вывод на экран',
      'Условия: if / else if / else, логические операторы',
      'Цикл while: накопитель, разбор числа по цифрам',
      'Цикл for и вложенные циклы',
      'Символы и строки: char, String, перебор символов',
      'Массивы: создание, перебор, поиск максимума, разворот',
      'Методы: параметры, возвращаемое значение, разбиение задачи на функции',
      'Ввод с клавиатуры (Scanner), проверка ввода, switch для меню',
      'Ошибки: чтение stack trace, отладчик IntelliJ',
      'Мини-проект: «Угадай число»',
      'Мини-проект: «Анализатор текста»',
      'Контрольная блока: три новые задачи без подсказок'
    ], goal: 'Превращать условие задачи в код самостоятельно: пересказать, разбить на шаги, написать и проверить.', project: 'Две мини-программы'
  },
  {
    id: 2, title: 'ООП и коллекции', weeks: '7–12', lessons: [
      'Класс и объект: поля, конструктор, методы',
      'Инкапсуляция: private, геттеры и сеттеры, this, static и final',
      'Наследование: extends, super, переопределение методов',
      'Полиморфизм и абстрактные классы',
      'Интерфейсы: чем отличаются от абстрактных классов',
      'Методы equals, hashCode, toString; enum',
      'Исключения: try / catch / finally, checked и unchecked, свои исключения',
      'Обобщения (generics) на уровне «пользоваться»; списки: ArrayList и LinkedList',
      'Множества и словари: HashSet, HashMap, TreeMap; как устроен HashMap',
      'Сортировка и порядок: Comparable, Comparator; стек и очередь (ArrayDeque)',
      'Проект «Мини-банк», часть 1: классы и наследование',
      'Проект «Мини-банк», часть 2: коллекции, исключения, сортировка',
      'Контрольная блока: вопросы по ООП и коллекциям'
    ], goal: 'Проектировать несколько связанных классов и выбирать подходящую коллекцию.', project: 'Консольный «Мини-банк»'
  },
  {
    id: 3, title: 'Streams, тесты, Maven, Git', weeks: '13–16', lessons: [
      'Лямбда-выражения и функциональные интерфейсы',
      'Stream API: map, filter, collect',
      'Stream API: groupingBy, sorted, reduce; Optional',
      'Современный синтаксис: record, switch-выражения, текстовые блоки',
      'Работа с файлами: чтение и запись, формат CSV',
      'Maven: структура проекта, зависимости, сборка',
      'Модульные тесты на JUnit 5',
      'Git в работе: ветки, pull request, конфликты',
      'Проект «Анализатор транзакций», часть 1: чтение данных и отчёты на Stream API',
      'Проект «Анализатор транзакций», часть 2: тесты и перенос «Мини-банка» на Maven'
    ], goal: 'Писать читаемый код на Stream API, покрывать его тестами и работать с проектом через Maven и Git.', project: '«Анализатор транзакций»'
  },
  {
    id: 4, title: 'SQL и PostgreSQL', weeks: '17–20', lessons: [
      'Что такое база данных; таблицы и типы данных; запуск PostgreSQL в Docker; CREATE TABLE и INSERT',
      'SELECT, WHERE, ORDER BY, LIMIT',
      'Агрегатные функции, GROUP BY, HAVING',
      'JOIN: INNER и LEFT',
      'Подзапросы, UPDATE, DELETE',
      'Первичные и внешние ключи, связи между таблицами, индексы',
      'Транзакции и ACID',
      'JDBC: подключение из Java, PreparedStatement, защита от SQL-инъекций',
      'Проект: схема банка, 25 запросов и JDBC-клиент',
      'Контрольная блока: 10 новых SQL-задач без подсказок'
    ], goal: 'Писать запросы с JOIN и группировкой, проектировать простую схему и работать с базой из Java.', project: 'Схема банка, 25 запросов, JDBC-клиент'
  },
  {
    id: 5, title: 'Spring Boot и REST', weeks: '21–26', lessons: [
      'Как устроен веб: HTTP, REST, JSON; Postman',
      'Первый проект на Spring Boot, контроллер',
      'Внедрение зависимостей (DI) и слои: контроллер → сервис → репозиторий',
      'Spring Data JPA: сущности и репозитории',
      'CRUD REST-API: клиенты и счета',
      'Валидация данных и обработка ошибок',
      'Транзакции в Spring: перевод между счетами',
      'Тестирование сервиса: JUnit и MockMvc',
      'Конфигурация (application.yml), Docker Compose для базы, запуск проекта одной командой',
      'Проект «Мини-банк» REST, часть 1: модель и API счетов',
      'Проект «Мини-банк» REST, часть 2: переводы и история операций',
      'Проект «Мини-банк» REST, часть 3: тесты и README',
      'Контрольная блока: рассказ о проекте и вопросы по Spring'
    ], goal: 'Собрать работающий backend-сервис с базой данных, тестами и понятной инструкцией запуска.', project: 'REST-сервис «Мини-банк»'
  },
  {
    id: 6, title: 'Java изнутри', weeks: '27–29', lessons: [
      'Память в Java: stack и heap, ссылки, String pool',
      'Сборка мусора (GC): общая идея',
      'Устройство ArrayList и HashMap изнутри (повторение)',
      'Потоки: Thread, Runnable, состояние гонки (race condition)',
      'synchronized, volatile, атомарные переменные',
      'ExecutorService, ConcurrentHashMap, CompletableFuture (обзор)',
      'Принципы SOLID и базовые паттерны на примерах проекта',
      'Список «40 вопросов»: составление и проговаривание вслух'
    ], goal: 'Отвечать на теоретические вопросы собеседования своими словами, без заучивания.', project: 'Список «40 вопросов с ответами»'
  },
  {
    id: 7, title: 'Собеседования', weeks: '30–32', lessons: [
      'Резюме на одну страницу и оформление GitHub',
      'Решение задач вслух (live-coding): как рассуждать при интервьюере',
      'Теоретическое интервью: тренировка на вопросах',
      'Пробное собеседование №1',
      'Пробное собеседование №2',
      'Поиск вакансий, отклики, тестовые задания, разбор оффера'
    ], goal: 'Уверенно проходить интервью: решать задачи вслух и рассказывать о своём проекте.', project: 'Резюме, пробные интервью, отклики'
  }
];

let lessonNumber = 1;
BLOCKS.forEach(block => block.lessons.forEach(title => { block.lessonRows = block.lessonRows || []; block.lessonRows.push({ id: lessonNumber++, title }); }));
const TOTAL_LESSONS = lessonNumber - 1;

const TASKS = [
  { id: 't1-check', lesson: 1, title: 'Расчёт чека', difficulty: 'Базовая', description: 'Упражнение из предыдущих занятий по переменным и арифметическим выражениям. В истории сохранилось название, но не полное исходное условие.', hints: ['Сначала выпиши, какие значения известны и что нужно получить.', 'Для каждого промежуточного результата заведи отдельную переменную.', 'Проверь вычисления на небольших числах вручную.'] },
  { id: 't1-balance', lesson: 1, title: 'Работа с балансом', difficulty: 'Базовая', description: 'Упражнение на хранение и изменение числового значения. Полное условие можно будет дополнить при переносе конспекта.', hints: ['Определи начальное значение баланса.', 'Раздели операции изменения баланса и вывод результата.', 'Проверь, что тип данных подходит для денежных значений в рамках учебной задачи.'] },
  { id: 't1-swap', lesson: 1, title: 'Обмен значений двух переменных', difficulty: 'Базовая', description: 'Практика на переменные: поменять местами значения двух переменных.', hints: ['Подумай, почему простое присваивание может затереть одно из значений.', 'Можно временно сохранить одно значение.', 'После обмена проверь обе переменные, а не только одну.'] },
  { id: 't2-atm', lesson: 2, title: 'Банкомат', difficulty: 'Базовая', description: 'Упражнение на ветвление: программа должна выбирать действие в зависимости от условий.', hints: ['Сначала сформулируй все возможные исходы.', 'Проверь порядок условий: более частный случай может идти раньше общего.', 'Отдельно проверь граничные значения.'] },
  { id: 't2-leap', lesson: 2, title: 'Високосный год', difficulty: 'Базовая', description: 'Определить, является ли год високосным, используя составное логическое условие.', hints: ['Год должен делиться на 400 или делиться на 4, но не делиться на 100.', 'Скобками явно покажи группы условий.', 'Проверь годы 1900, 2000 и 2024.'] },
  { id: 't3-digits', lesson: 3, title: 'Подсчёт нулей в числе', difficulty: 'Базовая', description: 'Разобрать число по последней цифре, проверить её и постепенно уменьшать исходное число.', hints: ['Последняя цифра получается через остаток от деления на 10: n % 10.', 'Чтобы убрать последнюю цифру, используй целочисленное деление на 10.', 'Проверь число с нулём в середине, например 505. Не забудь перезапустить программу после изменения входных данных.'], special: 'Проверка для 505 ожидает результат 1. В предыдущем чате на скриншоте отображался 0; повторный запуск ещё не подтверждён.' },
  { id: 't3-debt', lesson: 3, title: 'Погашение долга', difficulty: 'Базовая', description: 'Рассчитать, за сколько месяцев будет погашен долг с учётом размера очередного платежа и остатка.', hints: ['До цикла подготовь переменную остатка долга и счётчик месяцев.', 'На каждом шаге сравни платёж с остатком долга.', 'Проверь границы: долг 3000 должен закрыться за 1 месяц, 3001 — за 2.'] },
  {
    id: 't4-sum', lesson: 4, title: 'Сумма чисел от 1 до N', difficulty: 'Базовая',
    description: 'Программа получает целое число N и выводит сумму всех целых чисел от 1 до N включительно. Если N равно 0, выведи 0.',
    hints: ['Сначала создай переменную sum до цикла. Это накопитель: он должен сохранять значение между итерациями.', 'Нужен счётчик, который начинается с 1 и увеличивается на 1. Подумай, какое условие должно завершить цикл.', 'На каждом шаге прибавляй текущее значение счётчика к sum. Не забудь прочитать N через Scanner.'],
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        // Напиши решение здесь
    }
}`,
    tests: [
      { input: '5\n', expected: '15', label: 'Обычный случай: 1 + 2 + 3 + 4 + 5' },
      { input: '1\n', expected: '1', label: 'Минимальное положительное N' },
      { input: '0\n', expected: '0', label: 'Граница: N = 0' },
      { input: '10\n', expected: '55', label: 'Проверка накопления' }
    ]
  },
  {
    id: 't4-rectangle', lesson: 4, title: 'Прямоугольник из звёздочек', difficulty: 'Базовая',
    description: 'Вводятся два целых числа: высота H и ширина W. Выведи прямоугольник из символов * размером H строк на W столбцов. Между звёздочками не должно быть пробелов.',
    hints: ['Тебе понадобятся два цикла: внешний отвечает за строки, внутренний — за символы в одной строке.', 'После внутреннего цикла нужно перейти на новую строку. Если сделать это внутри внутреннего цикла, рисунок сломается.', 'Внешний цикл выполняется H раз, внутренний — W раз на каждой строке.'],
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int h = scanner.nextInt();
        int w = scanner.nextInt();

        // Напиши решение с двумя циклами
    }
}`,
    tests: [
      { input: '3 4\n', expected: '****\n****\n****', label: 'Прямоугольник 3 × 4' },
      { input: '1 5\n', expected: '*****', label: 'Одна строка' },
      { input: '2 2\n', expected: '**\n**', label: 'Квадрат 2 × 2' }
    ]
  }
];

const LESSON_DETAILS = {
  1: {
    goal: 'Научиться хранить данные в переменных, выбирать подходящий тип и выводить результат программы.',
    theory: [
      ['Переменная — именованное место для значения', 'Переменную объявляют с указанием типа и имени. После объявления значение можно читать и изменять. Имя лучше выбирать по смыслу: balance понятнее, чем x.'],
      ['Основные типы', 'int — целые числа; long — целые числа большего диапазона; double — числа с дробной частью; boolean — true или false; char — один символ. String используют для текста.'],
      ['Вывод в консоль', 'System.out.println(...) выводит значение и завершает строку. System.out.print(...) выводит без перехода на новую строку.'],
      ['Выбор типа имеет значение', 'Операции над целыми числами могут отличаться от операций над дробными. Например, деление int на int отбрасывает дробную часть. Не выбирай тип автоматически — думай, какие значения возможны.']
    ],
    code: 'int age = 19;\ndouble price = 149.90;\nboolean isActive = true;\nString name = "Alex";\n\nSystem.out.println(name);\nSystem.out.println(price);',
    questions: [
      ['Для чего нужна переменная?', 'Чтобы дать имя значению и использовать его в разных частях программы.'],
      ['Чем int отличается от double?', 'int хранит целые числа, double — числа с дробной частью.'],
      ['В чём разница между print и println?', 'println после вывода переводит курсор на следующую строку, print — нет.']
    ]
  },
  2: {
    goal: 'Научиться выбирать ветку выполнения программы в зависимости от условия.',
    theory: [
      ['Условие if', 'if проверяет логическое выражение. Если оно равно true, выполняется блок внутри фигурных скобок.'],
      ['else и else if', 'else выполняется, когда предыдущая проверка не прошла. else if позволяет проверить следующий вариант. Условия проверяются сверху вниз.'],
      ['Операторы сравнения', '== — равно; != — не равно; > и < — больше и меньше; >= и <= — больше или равно и меньше или равно. Для сравнения объектов и строк нельзя автоматически переносить правила сравнения примитивов.'],
      ['Логические операторы', '&& означает «и», || — «или», ! — отрицание. Скобки помогают явно показать, какие части условия должны объединяться.']
    ],
    code: 'if (balance >= payment) {\n    balance = balance - payment;\n} else {\n    System.out.println("Недостаточно средств");\n}',
    questions: [
      ['Когда выполняется ветка else?', 'Когда условие if и все предыдущие условия else if оказались ложными.'],
      ['Что означает &&?', 'Логическое «И»: обе части выражения должны быть true.'],
      ['Почему важен порядок условий?', 'Потому что программа проверяет их сверху вниз и выполняет первую подходящую ветку.']
    ]
  },
  3: {
    goal: 'Использовать while, накапливать результат и разбирать целое число по цифрам.',
    theory: [
      ['Как работает while', 'Сначала проверяется условие. Если оно true, выполняется тело цикла. Затем условие проверяется снова. Если внутри цикла ничего не меняет условие, можно получить бесконечный цикл.'],
      ['Накопитель и счётчик', 'Переменные sum и count обычно создают до цикла. На каждой итерации к ним добавляют новое значение. Так можно посчитать количество подходящих элементов или сумму.'],
      ['Разбор числа на цифры', 'Остаток n % 10 даёт последнюю цифру. Целочисленное деление n / 10 убирает её. Повторяя эти действия, можно пройти число справа налево.'],
      ['Граничные случаи', 'При n = 0 цикл while (n > 0) не выполнится ни разу. Поэтому результат будет 0. Для учебного упражнения это допущение было принято, но в реальной задаче смысл нуля нужно уточнить.']
    ],
    code: 'int n = 505;\nint count = 0;\n\nwhile (n > 0) {\n    int digit = n % 10;\n    if (digit == 0) {\n        count++;\n    }\n    n = n / 10;\n}\n\nSystem.out.println(count); // 1',
    questions: [
      ['Что возвращает n % 10?', 'Последнюю цифру положительного целого числа.'],
      ['Зачем выполняется n = n / 10?', 'Чтобы убрать уже обработанную последнюю цифру и перейти к следующей.'],
      ['Почему count объявляют до цикла?', 'Чтобы значение счётчика сохранялось между итерациями и после завершения цикла.']
    ]
  },
  4: {
    goal: 'Научиться повторять действия заданное количество раз с помощью for, понимать границы цикла и использовать вложенные циклы для обработки строк и таблиц.',
    theory: [
      ['Когда нужен for', 'Цикл for удобен, когда заранее известен счётчик или диапазон повторений. В заголовке обычно находятся три части: начальное значение, условие продолжения и изменение счётчика. Они разделены точками с запятой.'],
      ['Порядок выполнения', 'Сначала один раз выполняется инициализация (например, int i = 1). Затем проверяется условие i <= n. Если оно истинно, выполняется тело цикла. После тела выполняется шаг i++, и условие проверяется снова. Когда условие становится ложным, цикл заканчивается.'],
      ['Чтение цикла по частям', 'В записи for (int i = 1; i <= 5; i++) переменная i сначала равна 1; цикл работает, пока i не больше 5; после каждой итерации i увеличивается на 1. Поэтому тело выполнится пять раз: для 1, 2, 3, 4 и 5.'],
      ['for и while', 'Оба цикла позволяют повторять действия. while удобен, когда повторение зависит от условия и число шагов заранее неизвестно (например, пока пользователь не ввёл правильное значение). for чаще выбирают, когда есть счётчик или известный диапазон. Это не жёсткое правило: важнее понятность кода.'],
      ['Границы и ошибка на единицу', 'Условие i < n не включает n, а i <= n включает. Поэтому перед запуском выпиши, какие значения должен принять счётчик. Частая ошибка — начать с 0, но использовать <= n, из-за чего получится n + 1 итерация.'],
      ['Вложенные циклы', 'Один цикл можно разместить внутри другого. На каждой итерации внешнего цикла внутренний цикл выполняется полностью. Это удобно для таблиц, прямоугольников, матриц и пар элементов. В задаче с рисунком внешний цикл обычно отвечает за строки, внутренний — за символы в строке.'],
      ['Где объявлять переменные', 'Переменная, объявленная в заголовке for, доступна внутри этого цикла и его тела. Если значение нужно после цикла, объяви переменную до него. Накопитель суммы тоже обычно создают до цикла, чтобы он не обнулялся на каждой итерации.']
    ],
    code: 'int sum = 0;\nfor (int i = 1; i <= 5; i++) {\n    sum += i;\n}\nSystem.out.println(sum); // 15\n\n// Вложенные циклы: 2 строки по 3 звёздочки\nfor (int row = 1; row <= 2; row++) {\n    for (int col = 1; col <= 3; col++) {\n        System.out.print("*");\n    }\n    System.out.println();\n}',
    questions: [
      ['Сколько раз выполнится for (int i = 1; i <= 4; i++)?', 'Четыре раза: при i = 1, 2, 3 и 4.'],
      ['Что произойдёт, если написать i < 4 вместо i <= 4?', 'Тело выполнится три раза: при i = 1, 2 и 3. Значение 4 уже не войдёт в цикл.'],
      ['Сколько раз внутренний цикл выполнится, если внешний цикл делает 3 итерации, а внутренний — 4?', 'Всего 12 раз: четыре итерации внутреннего цикла на каждую из трёх итераций внешнего.']
    ],
    quiz: [
      { q: 'Сколько раз выполнится for (int i = 0; i < 5; i++)?', options: ['4 раза', '5 раз', '6 раз'], correct: 1, why: 'Счётчик примет значения 0, 1, 2, 3 и 4. При i = 5 условие i < 5 станет ложным.' },
      { q: 'Где обычно нужно объявить sum, если мы хотим накапливать сумму в цикле?', options: ['Внутри тела цикла', 'До цикла', 'Внутри условия if'], correct: 1, why: 'Если создавать и обнулять sum внутри цикла, накопление будет теряться на каждой итерации.' },
      { q: 'Какую задачу естественно решать двумя вложенными циклами?', options: ['Вывести прямоугольник из символов', 'Сравнить два числа один раз', 'Вывести одно сообщение'], correct: 0, why: 'Внешний цикл может отвечать за строки, внутренний — за символы в каждой строке.' }
    ]
  }
};

const INTERVIEW_GROUPS = [
  { title: 'Java Core', questions: ['Чем отличаются == и equals()?','Контракт equals() и hashCode(): что сломается, если его нарушить?','Почему String неизменяемый и что такое пул строк?','Когда нужен StringBuilder?','Примитивы и обёртки, автоупаковка.','Что делают final и static?','Модификаторы доступа.','Абстрактный класс и интерфейс: разница и когда что выбрать.','Checked и unchecked исключения.','Как работают finally и try-with-resources?','Зачем нужны дженерики? Что такое стирание типов?','Stack и heap; что делает сборщик мусора?'] },
  { title: 'Коллекции и Stream API', questions: ['Иерархия: Collection, List, Set, Queue, Map.','ArrayList и LinkedList: устройство и сложность операций.','Как устроен HashMap: бакеты, коллизии, расширение.','HashMap и TreeMap: когда что.','HashSet и TreeSet.','Comparable и Comparator.','Stream API: filter, map, collect; что значит «ленивые операции»?','Что будет, если менять коллекцию во время обхода циклом?'] },
  { title: 'Многопоточность', questions: ['Чем поток отличается от процесса?','Thread и Runnable.','Что такое гонка данных — пример со счётчиком.','synchronized и volatile: что гарантирует каждый?','Зачем нужен ExecutorService?'] },
  { title: 'ООП и качество кода', questions: ['Четыре принципа ООП на примере своего проекта.','SOLID — по одному примеру на каждую букву.','Композиция или наследование: что предпочесть и почему?'] },
  { title: 'SQL и базы данных', questions: ['Виды JOIN и чем они отличаются.','WHERE против HAVING.','Что такое индекс и когда он не помогает.','Транзакция и ACID.','Первичный и внешний ключ.'] },
  { title: 'HTTP, REST и Spring', questions: ['Методы HTTP; какие из них идемпотентны?','Коды ответов 2xx, 4xx, 5xx — примеры.','Что такое REST?','IoC и DI своими словами.','Что такое бин и какие бывают области видимости?','Зачем слои controller, service, repository?','Что делает @Transactional?'] }
];

const ALGORITHM_STEPS = [
  ['Массивы и строки', 'Перебор, поиск, частоты, разворот строки и массива.'],
  ['HashMap и HashSet', 'Подсчёт частот, быстрый поиск, проверка повторов.'],
  ['Два указателя и скользящее окно', 'Приёмы для массивов и строк, когда важно двигать границы диапазона.'],
  ['Стек и очередь', 'Скобочные последовательности, порядок обработки элементов.'],
  ['Сортировки и бинарный поиск', 'Сложность алгоритмов, сортировка и поиск по отсортированным данным.'],
  ['Рекурсия', 'Базовый случай, шаг рекурсии, разбор дерева вызовов.'],
  ['Деревья, BFS и DFS', 'Обходы графов и деревьев, поиск в ширину и глубину.']
];

const initialState = {
  completedLessons: [1, 2, 3, 4],
  taskStatus: { 't1-check': 'done', 't1-balance': 'done', 't1-swap': 'done', 't2-atm': 'done', 't2-leap': 'done', 't3-digits': 'repeat', 't3-debt': 'done' },
  hintCounts: {},
  drafts: {},
  journals: [],
  attempts: [],
  notes: {},
  quizScores: {},
  quizAnswers: {},
  testRuns: {},
  algorithmCount: 0,
  algorithmNotes: ''
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(initialState);
    const saved = JSON.parse(raw);
    const merged = { ...structuredClone(initialState), ...saved };
    merged.completedLessons = Array.from(new Set([...(Array.isArray(merged.completedLessons) ? merged.completedLessons : []), 4].map(Number))).sort((a,b)=>a-b);
    merged.taskStatus = { ...structuredClone(initialState.taskStatus), ...(saved.taskStatus || {}) };
    merged.testRuns = { ...structuredClone(initialState.testRuns), ...(saved.testRuns || {}) };
    // The learner explicitly confirmed in chat that lesson 4 is complete.
    // Preserve that confirmed progress when upgrading an older local save.
    // In the previous chat the output for 505 was still awaiting a confirmed rerun.
    // Older prototype builds marked all historical tasks done by default, so migrate that one state to review.
    if (merged.taskStatus['t3-digits'] === 'done' && !merged.testRuns['t3-digits']) merged.taskStatus['t3-digits'] = 'repeat';
    return merged;
  } catch (error) {
    console.warn('Не удалось прочитать сохранённый прогресс:', error);
    return structuredClone(initialState);
  }
}
let state = loadState();
let activeView = 'dashboard';
let currentLessonId = null;
let currentTaskId = null;
let currentTaskHintUsed = false;
let openBlockId = 1;

const pageContent = document.getElementById('page-content');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalContent = document.getElementById('modal-content');
const modalEyebrow = document.getElementById('modal-eyebrow');

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (error) { console.warn('Браузер не разрешил локальное сохранение:', error); }
  updateSidebarProgress();
}
function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function getLesson(id) {
  for (const block of BLOCKS) {
    const row = block.lessonRows.find(item => item.id === Number(id));
    if (row) return { ...row, block };
  }
  return null;
}
function getCompletedCount() { return state.completedLessons.length; }
function getNextIncompleteLessonId() {
  for (let id = 1; id <= TOTAL_LESSONS; id++) if (!state.completedLessons.includes(id)) return id;
  return TOTAL_LESSONS;
}
function getProgressPct() { return Math.round(getCompletedCount() / TOTAL_LESSONS * 100); }
function updateSidebarProgress() {
  document.getElementById('sidebar-progress-value').textContent = `${getProgressPct()}%`;
  document.getElementById('sidebar-progress-count').textContent = `${getCompletedCount()} / ${TOTAL_LESSONS} урока`;
  document.getElementById('sidebar-progress-bar').style.width = `${getCompletedCount() / TOTAL_LESSONS * 100}%`;
}
function setView(view) {
  activeView = view;
  document.querySelectorAll('.nav-item').forEach(button => button.classList.toggle('active', button.dataset.view === view));
  const names = { dashboard: 'Обзор', curriculum: 'Карта курса', practice: 'Практика', algorithms: 'Алгоритмы', journal: 'Журнал ошибок', interview: 'Собеседование' };
  document.getElementById('breadcrumb-current').textContent = names[view] || 'Обзор';
  document.getElementById('sidebar').classList.remove('open');
  renderView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function renderView() {
  const renderers = { dashboard: renderDashboard, curriculum: renderCurriculum, practice: renderPractice, algorithms: renderAlgorithms, journal: renderJournal, interview: renderInterview };
  pageContent.innerHTML = (renderers[activeView] || renderDashboard)();
  bindPageEvents();
}

function renderDashboard() {
  const blockOne = BLOCKS[0];
  const nextId = getNextIncompleteLessonId();
  const next = getLesson(nextId);
  const doneByBlock = BLOCKS.map(block => ({ ...block, done: block.lessonRows.filter(row => state.completedLessons.includes(row.id)).length }));
  return `
    <div class="page-heading"><div><div class="eyebrow">ПЛАН ОБУЧЕНИЯ · JAVA DEVELOPER</div><h1>Двигайся шаг за шагом.</h1><p class="lead">Твоя учебная программа, практика и история прогресса — в одном месте. Сначала самостоятельная попытка, потом подсказка, затем разбор.</p></div></div>
    <section class="hero-grid">
      <div class="hero-card"><div class="eyebrow">ТВОЯ ДОРОЖНАЯ КАРТА</div><h1>От первых циклов<br>до Java-стажировки.</h1><p>72 урока в семи блоках, проекты и отдельная подготовка к техническим отборам. Программа собрана по твоим двум учебным планам.</p><div class="hero-actions"><button class="btn btn-primary" data-view-link="curriculum">Открыть карту курса <span>→</span></button><button class="btn btn-light" data-view-link="practice">Мои упражнения</button></div></div>
      <div class="next-card"><div><div class="next-top"><span class="eyebrow">СЛЕДУЮЩИЙ ПО ПЛАНУ</span><span class="status-pill">Ещё не начат</span></div><h3>Урок ${nextId}. ${escapeHtml(next.title)}</h3><p>${nextId === 4 ? 'Цикл for и вложенные циклы: счётчик, границы и повторение действий.' : nextId === 5 ? 'Символы и строки: char, String, индексы, charAt(i) и перебор текста. Здесь вернёмся к задаче подсчёта цифр в строке.' : nextId <= 12 ? 'Подробная теория, вопросы и две практические задачи уже подготовлены для первого блока.' : 'Следующая тема по общей карте курса.'}</p></div><div class="next-meta"><span>${next.block.id}. ${escapeHtml(next.block.title)}</span><strong>Урок ${nextId} из ${TOTAL_LESSONS}</strong></div><button class="btn btn-primary" style="margin-top:12px" data-lesson="${nextId}">Открыть урок →</button></div>
    </section>
    <section class="stats-grid">
      <div class="stat-card"><div class="stat-top"><span>Пройдено уроков</span><span class="stat-icon">✓</span></div><strong>${getCompletedCount()} <small style="display:inline;font-size:12px">/ ${TOTAL_LESSONS}</small></strong><small>${getProgressPct()}% всей программы</small></div>
      <div class="stat-card"><div class="stat-top"><span>Учебных блоков</span><span class="stat-icon">▤</span></div><strong>7</strong><small>от Java-базы до интервью</small></div>
      <div class="stat-card"><div class="stat-top"><span>Учебный ритм</span><span class="stat-icon">◷</span></div><strong>~7 ч</strong><small>в неделю по карте курса</small></div>
      <div class="stat-card"><div class="stat-top"><span>Упражнений в истории</span><span class="stat-icon">⌘</span></div><strong>${TASKS.filter(t => state.taskStatus[t.id] === 'done').length}</strong><small>из перенесённых заданий</small></div>
    </section>
    <div class="dashboard-columns">
      <section class="panel"><div class="panel-head"><div><h3>Прогресс по блокам</h3><p>Учебная карта из документа «Карта курса Java»</p></div><button class="text-link" data-view-link="curriculum">Все блоки →</button></div>
        ${doneByBlock.map(block => `<div class="block-progress-row"><div class="block-info"><strong>${block.id}. ${escapeHtml(block.title)}</strong><small>Недели ${block.weeks} · ${block.lessonRows.length} уроков</small></div><div class="block-meter"><span>${block.done}/${block.lessonRows.length}</span><div class="progress-track"><div class="progress-fill" style="width:${block.done / block.lessonRows.length * 100}%"></div></div></div></div>`).join('')}
      </section>
      <section class="panel"><div class="panel-head"><div><h3>Как мы учимся</h3><p>Правила из твоего плана подготовки</p></div><span class="tag green">Без списывания</span></div>
        <div class="focus-list"><div class="focus-item"><div class="focus-number">25′</div><div><strong>Сначала сам</strong><p>25 минут на бумаге и в коде до первой подсказки.</p></div></div><div class="focus-item"><div class="focus-number">01</div><div><strong>Лестница подсказок</strong><p>Условие → конспект → идея без кода → разбор чужого решения.</p></div></div><div class="focus-item"><div class="focus-number">↻</div><div><strong>Повтор через день</strong><p>Если подсмотрел решение, закрой его и перепиши с нуля.</p></div></div><div class="focus-item"><div class="focus-number">Git</div><div><strong>Фиксируй результат</strong><p>Коммит после решённой задачи и короткая запись о новой ошибке.</p></div></div></div>
      </section>
    </div>
    <div class="notice"><span class="notice-icon">ⓘ</span><div><strong>Важная договорённость.</strong> Основной темп сайта — около 7 часов в неделю и 32 учебные недели по карте курса. Второй документ содержит более интенсивный вариант подготовки (около 12 часов в неделю); его требования к экзаменам и отбору вынесены в отдельные разделы, а не подменяют основной учебный план.</div></div>
    <div class="section-heading"><div><h2>Продолжение курса</h2><p>${getCompletedCount()} урока отмечены как пройденные</p></div><button class="text-link" data-view-link="curriculum">Вся программа →</button></div>
    <div class="panel"><div class="block-progress-row"><div class="block-info"><strong>✓ Уроки 1–4 · Основы Java и циклы</strong><small>Урок 4 отмечен пройденным по твоему подтверждению</small></div><span class="tag green">Пройдено</span></div><div class="block-progress-row"><div class="block-info"><strong>Урок ${nextId} · ${escapeHtml(next.title)}</strong><small>${nextId === 5 ? 'Урок 5 полностью подготовлен: расширенная теория, вопросы и две задачи.' : nextId <= 12 ? 'Материалы первого блока готовы.' : 'Следующая тема по карте курса.'}</small></div><button class="btn btn-light" data-lesson="${nextId}">Посмотреть план темы</button></div></div>
    <p class="footer-note">Данные хранятся локально в браузере на этом устройстве. Учётной записи и облачной синхронизации пока нет. Нажми на значок экспорта сверху, чтобы сохранить резервную копию прогресса.</p>
  `;
}

function renderCurriculum(filter = '') {
  const normalized = filter.trim().toLowerCase();
  const blocksHtml = BLOCKS.map(block => {
    const visibleRows = block.lessonRows.filter(row => `${row.id} ${row.title} ${block.title}`.toLowerCase().includes(normalized));
    if (!visibleRows.length) return '';
    const done = block.lessonRows.filter(row => state.completedLessons.includes(row.id)).length;
    const isOpen = normalized ? true : openBlockId === block.id;
    return `<section class="block-card ${isOpen ? 'open' : ''}"><button class="block-card-header" data-toggle-block="${block.id}"><span class="block-index">0${block.id}</span><span class="block-title-wrap"><strong>${escapeHtml(block.title)}</strong><small>Недели ${block.weeks} · ${block.lessonRows.length} уроков · ${escapeHtml(block.project)}</small></span><span class="block-card-meta"><strong>${done} / ${block.lessonRows.length}</strong><small>уроков пройдено</small></span><span class="chevron">⌄</span></button><div class="lesson-list">${visibleRows.map(row => {
      const isDone = state.completedLessons.includes(row.id);
      const isNext = row.id === getNextIncompleteLessonId();
      return `<button class="lesson-row ${isNext ? 'next' : ''}" data-lesson="${row.id}"><span class="lesson-num">${String(row.id).padStart(2,'0')}</span><span class="lesson-name"><strong>${escapeHtml(row.title)}</strong><small>${isDone ? 'Урок пройден' : isNext ? 'Следующий урок · теория и тесты готовы' : row.id <= 12 ? 'Теория, практика и разборы готовы' : 'Тема по плану'}</small></span><span class="lesson-state ${isDone ? 'done' : ''}">${isDone ? '✓' : isNext ? 'ДАЛЕЕ →' : '○'}</span></button>`;
    }).join('')}</div></section>`;
  }).join('');
  return `<div class="page-heading"><div><div class="eyebrow">ПОЛНАЯ ПРОГРАММА · 7 БЛОКОВ</div><h1>Карта курса.</h1><p class="lead">Все темы в том порядке, в котором они заданы в твоём учебном плане. Номера примерные: сложные темы можно делить, лёгкие — объединять.</p></div><div class="search-box"><span>⌕</span><input id="curriculum-search" type="search" placeholder="Найти урок или тему…" value="${escapeHtml(filter)}"></div></div>
  <div class="notice" style="margin:0 0 14px"><span class="notice-icon">✓</span><div><strong>Текущий прогресс: ${getCompletedCount()} из ${TOTAL_LESSONS}.</strong> Пройденные уроки перенесены из предыдущего обучения. Следующий урок выделен в карте курса.</div></div>
  <div class="block-list">${blocksHtml || '<div class="empty-state"><strong>Ничего не найдено</strong>Попробуй изменить поисковый запрос.</div>'}</div>
  <p class="footer-note">Источник структуры: «Карта курса: Java для стажёра и junior-разработчика». Цели и итоговые проекты блоков сохранены по документу.</p>`;
}

function taskStatusLabel(status) {
  return ({ done: ['green', 'Решено'], hint: ['amber', 'С подсказкой'], repeat: ['red', 'Повторить'], todo: ['', 'Не начато'] })[status] || ['', 'Не начато'];
}
function renderTaskCard(task) {
  const status = state.taskStatus[task.id] || 'todo';
  const [tone, label] = taskStatusLabel(status);
  const latest = state.attempts.filter(a => a.taskId === task.id).slice(-1)[0];
  return `<article class="exercise-card"><div class="exercise-top"><small>УРОК ${task.lesson} · ${task.difficulty}</small><span class="tag ${tone}">${label}</span></div><h3>${escapeHtml(task.title)}</h3><p>${escapeHtml(task.description)}</p>${task.special ? `<div class="notice" style="margin:0 0 12px"><span class="notice-icon">!</span><div>${escapeHtml(task.special)}</div></div>` : ''}<div class="exercise-actions"><button class="btn btn-light" data-task="${task.id}">Открыть упражнение</button>${latest ? `<span class="tag">Есть запись о попытке</span>` : ''}<select class="state-select" data-task-status="${task.id}" aria-label="Статус упражнения"><option value="todo" ${status==='todo'?'selected':''}>Не начато</option><option value="done" ${status==='done'?'selected':''}>Решено самостоятельно</option><option value="hint" ${status==='hint'?'selected':''}>Решено с подсказкой</option><option value="repeat" ${status==='repeat'?'selected':''}>Нужно повторить</option></select></div></article>`;
}
function renderPractice() {
  const groups = BLOCKS.slice(0, 3).map(block => ({ block, tasks: TASKS.filter(task => block.lessonRows.some(row => row.id === task.lesson)) })).filter(group => group.tasks.length);
  const runner = getRunnerSettings();
  const testReady = TASKS.filter(t => t.tests && t.tests.length).length;
  return `<div class="page-heading"><div><div class="eyebrow">ЗАДАЧИ И ПОПЫТКИ</div><h1>Практика.</h1><p class="lead">Пиши Java-код прямо здесь, запускай программу и проверяй её на тестовых данных. Черновики и результаты сохраняются на этом устройстве.</p></div></div>
    <div class="notice" style="margin:0 0 15px"><span class="notice-icon">ⓘ</span><div><strong>Как работает запуск.</strong> Для компиляции используется Judge0 — внешний изолированный исполнитель кода. Код отправляется на выбранный сервер. Не вставляй сюда пароли, ключи и чужие секретные данные. Если сервис недоступен или просит токен, укажи свой адрес Judge0 и токен ниже или запускай код в IntelliJ IDEA.</div></div>
    <div class="two-col"><div>${groups.map(({block,tasks}) => `<section class="panel" style="margin-bottom:13px"><div class="panel-head"><div><h3>${block.id}. ${escapeHtml(block.title)}</h3><p>Упражнения по пройденным и текущему уроку</p></div><span class="tag green">${tasks.filter(t => ['done','hint'].includes(state.taskStatus[t.id])).length}/${tasks.length}</span></div>${tasks.map(renderTaskCard).join('')}</section>`).join('')}</div>
    <aside><section class="panel"><div class="panel-head"><div><h3>Компилятор Java</h3><p>Можно изменить сервер, если стандартный недоступен</p></div><span class="tag">Judge0 CE</span></div>
      <div class="field"><label for="runner-endpoint">Адрес API</label><input id="runner-endpoint" type="url" value="${escapeHtml(runner.endpoint)}" placeholder="https://ce.judge0.com"></div>
      <div class="field"><label for="runner-token">Токен авторизации (необязательно)</label><input id="runner-token" type="password" value="${escapeHtml(runner.token)}" placeholder="Оставь пустым, если не требуется" autocomplete="off"></div>
      <div class="exercise-actions"><button class="btn btn-primary" id="save-runner">Сохранить настройки</button><button class="btn btn-light" id="test-runner">Проверить связь</button></div>
      <div id="runner-check-result" class="runner-result" aria-live="polite">Язык Java: OpenJDK 13 (Judge0 CE, language_id 62). Для текущих задач с циклами подходит. Когда дойдём до record и других возможностей Java 16+, будем использовать локальный JDK 21 или настроим другой исполнитель. Токен хранится только в этом браузере и не попадёт в экспорт прогресса.</div>
    </section>
    <section class="panel" style="margin-top:13px"><div class="panel-head"><div><h3>Как засчитываем задачу</h3><p>Качество решения важнее галочки</p></div></div><div class="focus-list"><div class="focus-item"><div class="focus-number">01</div><div><strong>Самостоятельно</strong><p>Все тесты пройдены без подсказок, и ты можешь объяснить решение.</p></div></div><div class="focus-item"><div class="focus-number">02</div><div><strong>С подсказкой</strong><p>Тесты пройдены, но понадобились подсказки. Это нормально — отметь, где застрял.</p></div></div><div class="focus-item"><div class="focus-number">03</div><div><strong>Повторить</strong><p>Тесты не пройдены или решение пока не получается воспроизвести.</p></div></div></div></section>
    <section class="panel" style="margin-top:13px"><h3>История попыток</h3><p class="lead" style="font-size:10px">Всего сохранено: <strong>${state.attempts.length}</strong></p><p class="lead" style="font-size:10px">Задач с автоматическими тестами: <strong>${testReady}</strong></p><button class="btn btn-light" data-view-link="journal">Открыть журнал ошибок</button></section></aside></div>`;
}
function renderAlgorithms() {
  return `<div class="page-heading"><div><div class="eyebrow">СКВОЗНОЙ ТРЕК · С БЛОКА 2</div><h1>Алгоритмы.</h1><p class="lead">Отдельная линия практики, которая идёт параллельно основным урокам. Последовательность перенесена из карты курса.</p></div></div>
    <div class="two-col"><section class="panel"><div class="panel-head"><div><h3>Темы по порядку</h3><p>Сначала база, затем типовые приёмы</p></div><span class="tag green">~30 Easy по карте курса</span></div>${ALGORITHM_STEPS.map((step,i)=>`<div class="algorithm-step"><div class="step-dot">${i+1}</div><div><strong>${escapeHtml(step[0])}</strong><p>${escapeHtml(step[1])}</p></div></div>`).join('')}</section>
    <aside><section class="panel"><h3>Счётчик решённых задач</h3><p class="lead" style="font-size:10px;margin-bottom:15px">Записывай количество задач по алгоритмам, которые решил самостоятельно.</p><div class="field"><label for="algorithm-count">Решено задач</label><input id="algorithm-count" type="number" min="0" max="999" value="${Number(state.algorithmCount)||0}"></div><div class="field"><label for="algorithm-notes">Какие приёмы уже встречались</label><textarea id="algorithm-notes" placeholder="Например: частоты через HashMap, два указателя…">${escapeHtml(state.algorithmNotes || '')}</textarea></div><button class="btn btn-primary" id="save-algorithms">Сохранить</button></section>
    <section class="panel" style="margin-top:13px"><h3>Интенсивная подготовка к отбору</h3><p class="lead" style="font-size:10px">Во втором документе есть отдельная, более интенсивная практика для технических экзаменов: 40 базовых задач, 20 задач на HashMap/HashSet и затем 60 задач по алгоритмам на этапе подготовки к экзамену, плюс виртуальные контесты.</p><div class="notice"><span class="notice-icon">ⓘ</span><div>Эти числа относятся к интенсивному плану на ~12 часов в неделю. Они не заменяют ориентир около 30 Easy и ~1 часа алгоритмов в неделю из основной карты курса.</div></div></section></aside></div>`;
}
function renderJournal() {
  const entries = [...state.journals].reverse();
  const attempts = [...state.attempts].reverse();
  return `<div class="page-heading"><div><div class="eyebrow">ЧТО ПОШЛО НЕ ТАК И ЧТО ЗАПОМНИТЬ</div><h1>Журнал ошибок.</h1><p class="lead">Записывай не только ошибку, но и правило, которое поможет не повторить её. Возвращайся к записям перед контрольными и контестами.</p></div></div>
    <div class="two-col"><section class="panel"><div class="panel-head"><div><h3>Добавить запись</h3><p>Одна ошибка — одно правило на будущее</p></div></div><form id="journal-form"><div class="field"><label for="journal-title">Задача или тема</label><input id="journal-title" required placeholder="Например: подсчёт цифр в числе"></div><div class="field"><label for="journal-error">Где застрял / что было не так</label><textarea id="journal-error" required placeholder="Опиши ошибку своими словами…"></textarea></div><div class="field"><label for="journal-rule">Правило на будущее</label><textarea id="journal-rule" required placeholder="Что нужно проверить в следующий раз?"></textarea></div><button class="btn btn-primary" type="submit">Сохранить запись</button></form></section>
    <section class="panel"><div class="panel-head"><div><h3>Мои записи</h3><p>${entries.length} записей в журнале</p></div></div>${entries.length ? entries.map(entry=>`<div class="journal-entry"><strong>${escapeHtml(entry.title)}</strong><small>${escapeHtml(entry.date)}</small><p><b>Ошибка:</b> ${escapeHtml(entry.error)}\n<b>Правило:</b> ${escapeHtml(entry.rule)}</p></div>`).join('') : '<div class="empty-state"><strong>Пока пусто</strong>Добавь первую запись после самостоятельной попытки.</div>'}</section></div>
    <section class="panel" style="margin-top:15px"><div class="panel-head"><div><h3>История попыток упражнений</h3><p>Код и заметки, сохранённые при работе над задачами</p></div><span class="tag">${attempts.length} попыток</span></div>${attempts.length ? attempts.map(item=>`<div class="journal-entry"><strong>${escapeHtml(item.title)} · ${escapeHtml(item.result)}</strong><small>${escapeHtml(item.date)} · использовано подсказок: ${item.hints}</small><p>${escapeHtml(item.note || 'Без заметки')}</p></div>`).join('') : '<div class="empty-state"><strong>Попыток пока нет</strong>Открой упражнение в разделе «Практика» и сохрани результат.</div>'}</section>`;
}
function renderInterview() {
  const total = INTERVIEW_GROUPS.reduce((sum,g)=>sum+g.questions.length,0);
  return `<div class="page-heading"><div><div class="eyebrow">БАНК ВОПРОСОВ И LIVE-CODING</div><h1>Собеседование.</h1><p class="lead">Вопросы из плана подготовки. Отвечай своими словами за 1–2 минуты и добавляй свои заметки в журнал.</p></div><span class="status-pill green">${total} вопросов</span></div>
  <div class="two-col"><section class="panel">${INTERVIEW_GROUPS.map(group=>`<div class="question-group"><h3>${escapeHtml(group.title)} <span class="tag">${group.questions.length}</span></h3>${group.questions.map(q=>`<details class="question-item"><summary>${escapeHtml(q)}</summary><p>Сформулируй ответ своими словами. Старайся привести пример из своего проекта и назвать, где это применяется.</p></details>`).join('')}</div>`).join('')}</section>
  <aside><section class="panel"><h3>Тренировка live-coding</h3><p class="lead" style="font-size:10px">Перед написанием кода используй один и тот же порядок действий.</p><div class="focus-list"><div class="focus-item"><div class="focus-number">1</div><div><strong>Перескажи условие</strong><p>Уточни крайние случаи: пустой ввод, отрицательные числа, переполнение.</p></div></div><div class="focus-item"><div class="focus-number">2</div><div><strong>Назови идею и сложность</strong><p>Объясни подход до того, как начнёшь писать код.</p></div></div><div class="focus-item"><div class="focus-number">3</div><div><strong>Пиши и проговаривай</strong><p>Комментируй рассуждения, не молчи при затруднении.</p></div></div><div class="focus-item"><div class="focus-number">4</div><div><strong>Проверь вручную</strong><p>Прогони пример и крайние случаи.</p></div></div></div></section>
  <section class="panel" style="margin-top:13px"><h3>Цели этапа собеседований</h3><ul style="padding-left:17px;color:#758178;font-size:10px;line-height:1.9"><li>30 из 40 вопросов — без подсказок.</li><li>Easy вслух примерно за 20 минут.</li><li>Рассказ о себе и проекте за 2–3 минуты.</li><li>Два пробных интервью в неделю на финальном этапе.</li></ul></section></aside></div>`;
}

function bindPageEvents() {
  pageContent.querySelectorAll('[data-view-link]').forEach(el => el.addEventListener('click', () => setView(el.dataset.viewLink)));
  pageContent.querySelectorAll('[data-lesson]').forEach(el => el.addEventListener('click', () => openLesson(Number(el.dataset.lesson))));
  pageContent.querySelectorAll('[data-task]').forEach(el => el.addEventListener('click', () => openTask(el.dataset.task)));
  pageContent.querySelectorAll('[data-toggle-block]').forEach(el => el.addEventListener('click', () => { openBlockId = Number(el.dataset.toggleBlock); renderView(); }));
  pageContent.querySelectorAll('[data-task-status]').forEach(el => el.addEventListener('change', () => { state.taskStatus[el.dataset.taskStatus] = el.value; persist(); renderView(); }));
  const search = document.getElementById('curriculum-search');
  if (search) search.addEventListener('input', () => { const pos = search.selectionStart; pageContent.innerHTML = renderCurriculum(search.value); bindPageEvents(); const updated = document.getElementById('curriculum-search'); updated.focus(); updated.setSelectionRange(pos,pos); });
  const journalForm = document.getElementById('journal-form');
  if (journalForm) journalForm.addEventListener('submit', event => {
    event.preventDefault();
    state.journals.push({ title: document.getElementById('journal-title').value.trim(), error: document.getElementById('journal-error').value.trim(), rule: document.getElementById('journal-rule').value.trim(), date: new Date().toLocaleString('ru-RU') });
    persist(); renderView();
  });
  const saveAlgorithms = document.getElementById('save-algorithms');
  if (saveAlgorithms) saveAlgorithms.addEventListener('click', () => { state.algorithmCount = Math.max(0, Number(document.getElementById('algorithm-count').value) || 0); state.algorithmNotes = document.getElementById('algorithm-notes').value; persist(); saveAlgorithms.textContent = 'Сохранено ✓'; });
  const saveRunner = document.getElementById('save-runner');
  if (saveRunner) saveRunner.addEventListener('click', () => {
    const endpoint = document.getElementById('runner-endpoint').value.trim().replace(/\/+$/, '');
    const token = document.getElementById('runner-token').value.trim();
    if (!/^https:\/\//i.test(endpoint)) { showRunnerMessage('Укажи полный HTTPS-адрес API.', 'bad'); return; }
    saveRunnerSettings({ endpoint, token });
    showRunnerMessage('Настройки сохранены в этом браузере.', 'good');
  });
  const testRunner = document.getElementById('test-runner');
  if (testRunner) testRunner.addEventListener('click', checkRunnerConnection);
}

function openModal(eyebrow, html) {
  modalEyebrow.textContent = eyebrow;
  modalContent.innerHTML = html;
  modalBackdrop.classList.add('show');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const focusable = modalContent.querySelector('button, input, textarea, select');
  if (focusable) setTimeout(() => focusable.focus(), 30);
}
function closeModal() {
  modalBackdrop.classList.remove('show');
  modalBackdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  currentTaskId = null;
}
function openLesson(id) {
  const lesson = getLesson(id);
  if (!lesson) return;
  currentLessonId = id;
  const done = state.completedLessons.includes(id);
  const detail = LESSON_DETAILS[id];
  let body = '';
  if (detail) {
    const quizHtml = detail.quiz ? `<div class="modal-section"><div class="panel-head"><div><h3>Проверка понимания</h3><p>Ответь самостоятельно, затем нажми «Проверить ответы».</p></div><span class="tag">${detail.quiz.length} вопроса</span></div><form id="lesson-quiz">${detail.quiz.map((q,i)=>`<div class="quiz-question"><strong>${i+1}. ${escapeHtml(q.q)}</strong>${q.options.map((option,j)=>`<label class="quiz-option"><input type="radio" name="q${i}" value="${j}" ${Number(state.quizAnswers[id]?.[i])===j?'checked':''}> <span>${escapeHtml(option)}</span></label>`).join('')}<div class="quiz-explain" id="quiz-explain-${i}"></div></div>`).join('')}<button class="btn btn-primary" type="submit">Проверить ответы</button><div id="quiz-score" class="quiz-result" aria-live="polite">${state.quizScores[id] !== undefined ? `Последний результат: ${state.quizScores[id]} из ${detail.quiz.length}.` : 'Результат сохранится в прогрессе.'}</div></form></div>` : '';
    const lessonTasks = id === 4 ? `<div class="modal-section"><h3>Практика — две задачи</h3><p>Сначала закончи теорию и вопросы, затем реши обе задачи. Для каждой доступны три уровня подсказок и автоматические тесты.</p><div class="lesson-task-links"><button class="btn btn-light" data-open-task="t4-sum">Задача 1 · Сумма от 1 до N</button><button class="btn btn-light" data-open-task="t4-rectangle">Задача 2 · Прямоугольник из звёздочек</button></div></div>` : `<div class="modal-section"><h3>Что было в практике</h3><p>Задания и история попыток находятся в разделе «Практика». Для этого урока сохранены названия решённых упражнений и их текущий статус.</p><button class="btn btn-light" data-modal-view="practice">Перейти к упражнениям →</button></div>`;
    const completionHtml = id === 4 ? `<div class="modal-section"><div class="lesson-complete-state"><div><strong>Условия завершения урока</strong><p>Ответь правильно минимум на 2 вопроса из 3 и отметь обе задачи как решённые (самостоятельно или с подсказкой).</p></div><span class="tag ${done?'green':''}">${done?'Урок пройден':'В процессе'}</span></div><button class="btn btn-primary" id="mark-lesson-complete" ${canCompleteLesson(id)?'':'disabled'}>${done?'Урок уже пройден':'Отметить урок пройденным'}</button></div>` : '';
    body = `<div class="eyebrow">БЛОК ${lesson.block.id} · УРОК ${id}</div><h2 id="modal-title">${escapeHtml(lesson.title)}</h2><p class="modal-lead">${escapeHtml(detail.goal)}</p>
      ${id === 4 ? `<div class="lesson-roadmap"><span>1 · Теория</span><span>2 · Вопросы</span><span>3 · Две задачи</span><span>4 · Самопроверка</span></div>` : ''}
      <div class="modal-section"><h3>Теория</h3>${detail.theory.map((part,i)=>`<article class="theory-chunk"><h4>${i+1}. ${escapeHtml(part[0])}</h4><p>${escapeHtml(part[1])}</p></article>`).join('')}</div>
      <div class="modal-section"><h3>Пример кода</h3><pre class="code-sample">${escapeHtml(detail.code)}</pre><p class="small-muted">Не просто копируй пример: пройди его по шагам и объясни, когда выполняется каждая строка.</p></div>
      <div class="modal-section"><h3>Вопросы на понимание</h3>${detail.questions.map((q,i)=>`<details class="question-item"><summary>${escapeHtml(q[0])}</summary><p>${escapeHtml(q[1])}</p></details>`).join('')}</div>
      ${quizHtml}${lessonTasks}
      <div class="modal-section"><div class="field"><label for="lesson-note">Мои заметки по уроку</label><textarea id="lesson-note" placeholder="Запиши, что было непонятно или что хочется повторить…">${escapeHtml(state.notes[id] || '')}</textarea></div><button class="btn btn-light" id="save-lesson-note">Сохранить заметку</button> <span class="tag ${done?'green':''}">${done?'Пройдено':'В процессе'}</span></div>
      ${completionHtml}`;
  } else {
    body = `<div class="eyebrow">БЛОК ${lesson.block.id} · УРОК ${id}</div><h2 id="modal-title">${escapeHtml(lesson.title)}</h2><p class="modal-lead">Подробная теория и упражнения для этой темы будут добавлены перед её прохождением. Пока здесь сохранено место темы в общей последовательности.</p><div class="modal-section"><h3>Цель блока</h3><p>${escapeHtml(lesson.block.goal)}</p></div><div class="modal-section"><h3>Итог блока</h3><p>${escapeHtml(lesson.block.project)}</p></div><span class="status-pill gray">По плану · ещё не пройдено</span>`;
  }
  openModal(`УРОК ${String(id).padStart(2,'0')}`, body);
  const saveNote = document.getElementById('save-lesson-note');
  if (saveNote) saveNote.addEventListener('click', () => { state.notes[id] = document.getElementById('lesson-note').value; persist(); saveNote.textContent = 'Сохранено ✓'; });
  const modalView = modalContent.querySelector('[data-modal-view]');
  if (modalView) modalView.addEventListener('click', () => { closeModal(); setView(modalView.dataset.modalView); });
  modalContent.querySelectorAll('[data-open-task]').forEach(btn => btn.addEventListener('click', () => openTask(btn.dataset.openTask)));
  const quiz = document.getElementById('lesson-quiz');
  if (quiz) quiz.addEventListener('submit', event => {
    event.preventDefault();
    let score = 0;
    const answers = [];
    detail.quiz.forEach((q,i) => {
      const selected = quiz.querySelector(`input[name="q${i}"]:checked`);
      const value = selected ? Number(selected.value) : -1;
      answers.push(value);
      const explain = document.getElementById(`quiz-explain-${i}`);
      const correct = value === q.correct;
      if (correct) score++;
      explain.className = `quiz-explain ${correct?'good':'bad'}`;
      explain.textContent = `${correct?'Верно.':'Пока неверно.'} ${q.why}`;
    });
    state.quizAnswers[id] = answers;
    state.quizScores[id] = score;
    persist();
    document.getElementById('quiz-score').className = `quiz-result ${score >= 2 ? 'good' : 'bad'}`;
    document.getElementById('quiz-score').textContent = `Результат: ${score} из ${detail.quiz.length}. ${score >= 2 ? 'Минимальный порог достигнут.' : 'Повтори разделы, в которых ошибся, и попробуй ещё раз.'}`;
    const complete = document.getElementById('mark-lesson-complete');
    if (complete) complete.disabled = !canCompleteLesson(id);
  });
  const markComplete = document.getElementById('mark-lesson-complete');
  if (markComplete) markComplete.addEventListener('click', () => {
    if (!canCompleteLesson(id)) return;
    if (!state.completedLessons.includes(id)) state.completedLessons.push(id);
    state.completedLessons.sort((a,b)=>a-b);
    persist(); closeModal(); renderView();
  });
}

function openTask(taskId, preserveHintUse = false) {
  if (!preserveHintUse) currentTaskHintUsed = false;
  const task = TASKS.find(item => item.id === taskId);
  if (!task) return;
  currentTaskId = taskId;
  const hints = task.hints || [];
  const shown = Math.min(hints.length, Number(state.hintCounts[taskId]) || 0);
  const status = state.taskStatus[taskId] || 'todo';
  const hintHtml = hints.map((hint,i)=> i < shown ? `<div class="hint-card"><b>Подсказка ${i+1}.</b> ${escapeHtml(hint)}</div>` : `<div class="hint-card locked">Подсказка ${i+1} скрыта. Откроется по запросу.</div>`).join('');
  const hasTests = Array.isArray(task.tests) && task.tests.length;
  const previousRun = state.testRuns[taskId];
  const testInfo = hasTests ? `<div class="test-case-list"><strong>Набор тестов (${task.tests.length})</strong>${task.tests.map((test,i)=>`<div class="test-case"><span>${i+1}. ${escapeHtml(test.label || 'Тест')}</span><code>Ввод: ${escapeHtml(test.input.trim() || 'пусто')} · Ожидается: ${escapeHtml(test.expected.replace(/\n/g,' ↵ ').trim() || 'пустой вывод')}</code></div>`).join('')}</div>` : '';
  const runPanel = hasTests ? `<div class="modal-section"><div class="panel-head"><div><h3>Автоматическая проверка</h3><p>Запусти все тесты. Система сравнит вывод программы с ожидаемым результатом.</p></div><span class="tag">${task.tests.length} тестов</span></div><button class="btn btn-primary" id="run-task-tests">▶ Проверить все тесты</button><div id="task-test-result" class="run-results" aria-live="polite">${previousRun ? renderTestRun(previousRun) : 'Пока нет результатов. Сначала попробуй написать решение самостоятельно.'}</div></div>` : '';
  openModal(`ПРАКТИКА · УРОК ${task.lesson}`, `<div class="eyebrow">${task.difficulty.toUpperCase()}</div><h2 id="modal-title">${escapeHtml(task.title)}</h2><p class="modal-lead">${escapeHtml(task.description)}</p>${task.special ? `<div class="notice"><span class="notice-icon">!</span><div>${escapeHtml(task.special)}</div></div>` : ''}
    ${testInfo}
    <div class="modal-section"><div class="panel-head"><div><h3>Редактор Java</h3><p>Класс должен называться Main. Используй Scanner для чтения входных данных.</p></div><span class="tag">Java</span></div><div class="field"><label for="task-draft">Твой код</label><textarea id="task-draft" class="java-editor" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" placeholder="Напиши решение на Java…">${escapeHtml(state.drafts[taskId] || task.starterCode || '')}</textarea></div><div class="editor-toolbar"><span>Ctrl + Enter — запустить с тестовым вводом</span><button class="btn btn-quiet" id="save-task-draft">Сохранить черновик</button></div><div class="field"><label for="task-stdin">Входные данные для запуска</label><textarea id="task-stdin" class="stdin-editor" spellcheck="false" placeholder="Например: 5">${escapeHtml(task.tests?.[0]?.input || '')}</textarea></div><div class="exercise-actions"><button class="btn btn-light" id="run-task-once">▶ Запустить код</button><span class="small-muted">Один запуск не засчитывает задачу — он только показывает вывод.</span></div><div id="task-run-output" class="console-output" aria-live="polite">Вывод программы появится здесь.</div></div>
    ${runPanel}
    <div class="modal-section"><div class="panel-head"><div><h3>Лестница подсказок</h3><p>Сначала попробуй сам. Открывай по одной, если застрял.</p></div><span class="tag">${shown}/${hints.length}</span></div><div class="hint-stack">${hintHtml || '<div class="hint-card">Подсказки для этого упражнения будут добавлены вместе с полным конспектом.</div>'}</div><button class="btn btn-light" id="reveal-hint" ${shown>=hints.length?'disabled':''}>Открыть следующую подсказку</button></div>
    <div class="modal-section"><div class="field"><label for="task-note">Что получилось / где застрял</label><textarea id="task-note" placeholder="Крайние случаи, ошибка компиляции, что пришлось подсмотреть…"></textarea></div><div class="field"><label for="task-result">Статус решения</label><select id="task-result"><option value="done" ${status==='done'?'selected':''}>Решено самостоятельно, без подсказок</option><option value="hint" ${status==='hint'?'selected':''}>Решено с подсказками</option><option value="repeat" ${status==='repeat'?'selected':''}>Посмотрел разбор / нужно повторить</option><option value="todo" ${status==='todo'?'selected':''}>Пока не решил</option></select></div><button class="btn btn-primary" id="save-task-attempt">Сохранить результат и заметку</button></div>
    <p class="footer-note">Код выполняется на внешнем сервере Judge0 в изолированной среде. Если сервер не отвечает, сохрани черновик и запусти этот же код в IntelliJ IDEA. Результат запуска и тестов сохраняется локально.</p>`);
  const editor = document.getElementById('task-draft');
  const saveDraft = () => { state.drafts[taskId] = editor.value; persist(); };
  editor.addEventListener('input', saveDraft);
  document.getElementById('save-task-draft').addEventListener('click', () => { saveDraft(); document.getElementById('save-task-draft').textContent = 'Сохранено ✓'; });
  document.getElementById('reveal-hint').addEventListener('click', () => {
    state.hintCounts[taskId] = Math.min(hints.length, (Number(state.hintCounts[taskId]) || 0) + 1);
    currentTaskHintUsed = true;
    persist(); openTask(taskId, true);
  });
  const runOnce = async () => {
    const output = document.getElementById('task-run-output');
    const source = editor.value.trim();
    if (!source) { output.textContent = 'Сначала напиши код.'; return; }
    output.textContent = 'Компиляция и запуск…';
    const button = document.getElementById('run-task-once'); button.disabled = true;
    try {
      const result = await executeJava(source, document.getElementById('task-stdin').value);
      output.innerHTML = renderExecution(result);
    } catch (error) { output.textContent = `Не удалось выполнить код: ${error.message}`; }
    finally { button.disabled = false; }
    saveDraft();
  };
  const runTests = async () => {
    const output = document.getElementById('task-test-result');
    const button = document.getElementById('run-task-tests');
    const source = editor.value.trim();
    if (!source) { output.textContent = 'Сначала напиши код.'; return; }
    button.disabled = true; button.textContent = 'Проверяем…'; output.textContent = 'Запускаем тестовые случаи по очереди. Это может занять несколько секунд…';
    saveDraft();
    const results = [];
    try {
      for (let i=0;i<task.tests.length;i++) {
        const test = task.tests[i];
        const execution = await executeJava(source, test.input);
        const expected = normalizeOutput(test.expected);
        const actual = normalizeOutput(execution.stdout || '');
        const passed = execution.statusId === 3 && expected === actual;
        results.push({ label: test.label || `Тест ${i+1}`, passed, expected: test.expected, actual: execution.stdout || '', status: execution.statusId === 3 ? 'Вывод отличается от ожидаемого' : execution.status, compileOutput: execution.compileOutput, stderr: execution.stderr });
        if (execution.statusId !== 3) break;
      }
      const allPassed = results.length === task.tests.length && results.every(r=>r.passed);
      const hintUsed = currentTaskHintUsed;
      state.taskStatus[taskId] = allPassed ? (hintUsed ? 'hint' : 'done') : 'repeat';
      const runRecord = { date: new Date().toLocaleString('ru-RU'), passed: results.filter(r=>r.passed).length, total: task.tests.length, allPassed, results };
      state.testRuns[taskId] = runRecord;
      state.attempts.push({ taskId, title: task.title, note: allPassed ? 'Все автоматические тесты пройдены.' : 'Не все автоматические тесты пройдены.', result: allPassed ? (hintUsed ? 'Тесты пройдены с подсказкой' : 'Тесты пройдены самостоятельно') : 'Нужно повторить', hints: Number(state.hintCounts[taskId]) || 0, date: runRecord.date });
      persist(); output.innerHTML = renderTestRun(runRecord);
      const select = document.getElementById('task-result');
      if (select) select.value = state.taskStatus[taskId];
    } catch (error) { output.textContent = `Ошибка проверки: ${error.message}`; }
    finally { button.disabled = false; button.textContent = '▶ Проверить все тесты'; }
  };
  document.getElementById('run-task-once').addEventListener('click', runOnce);
  if (document.getElementById('run-task-tests')) document.getElementById('run-task-tests').addEventListener('click', runTests);
  editor.addEventListener('keydown', event => {
    if (event.key === 'Tab') { event.preventDefault(); const start = editor.selectionStart, end = editor.selectionEnd; editor.value = editor.value.slice(0,start) + '    ' + editor.value.slice(end); editor.selectionStart = editor.selectionEnd = start + 4; saveDraft(); }
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); runOnce(); }
  });
  document.getElementById('save-task-attempt').addEventListener('click', () => {
    const draft = editor.value;
    const note = document.getElementById('task-note').value.trim();
    const result = document.getElementById('task-result').value;
    state.drafts[taskId] = draft;
    state.taskStatus[taskId] = result;
    state.attempts.push({ taskId, title: task.title, note: note || 'Без заметки', result: ({done:'Самостоятельно',hint:'С подсказкой',repeat:'Нужно повторить',todo:'Не решено'})[result], hints: Number(state.hintCounts[taskId]) || 0, date: new Date().toLocaleString('ru-RU') });
    persist(); closeModal(); renderView();
  });
}

function canCompleteLesson(id) {
  if (id !== 4) return false;
  const score = Number(state.quizScores[id] ?? -1);
  return score >= 2 && ['t4-sum','t4-rectangle'].every(taskId => ['done','hint'].includes(state.taskStatus[taskId]));
}

function normalizeOutput(value) {
  return String(value ?? '').replace(/\r/g,'').trim().split(/\s+/).join(' ');
}

function getRunnerSettings() {
  const fallback = { endpoint: 'https://ce.judge0.com', token: '' };
  try { return { ...fallback, ...(JSON.parse(localStorage.getItem('java-lab-runner-settings-v1') || '{}')) }; }
  catch { return fallback; }
}

function saveRunnerSettings(settings) {
  localStorage.setItem('java-lab-runner-settings-v1', JSON.stringify(settings));
}

function showRunnerMessage(message, tone='') {
  const target = document.getElementById('runner-check-result');
  if (target) { target.className = `runner-result ${tone}`; target.textContent = message; }
}

async function checkRunnerConnection() {
  const button = document.getElementById('test-runner');
  const result = document.getElementById('runner-check-result');
  if (!button || !result) return;
  const endpoint = document.getElementById('runner-endpoint').value.trim().replace(/\/+$/, '');
  const token = document.getElementById('runner-token').value.trim();
  if (!/^https:\/\//i.test(endpoint)) { showRunnerMessage('Укажи полный HTTPS-адрес API.', 'bad'); return; }
  saveRunnerSettings({ endpoint, token });
  button.disabled = true; result.className='runner-result'; result.textContent='Проверяем доступность Java-компилятора…';
  try {
    const headers = {}; if (token) headers['X-Auth-Token'] = token;
    const response = await fetch(`${endpoint}/languages/62`, { headers });
    if (!response.ok) throw new Error(`Сервер ответил HTTP ${response.status}. Проверь адрес и токен.`);
    const language = await response.json();
    showRunnerMessage(`Связь установлена: ${language.name || 'Java'}. Можно запускать упражнения.`, 'good');
  } catch (error) {
    showRunnerMessage(`Не удалось подключиться: ${error.message}. Проверь интернет, адрес API, токен и доступ к запросам из браузера.`, 'bad');
  } finally { button.disabled = false; }
}

async function executeJava(sourceCode, stdin='') {
  const { endpoint, token } = getRunnerSettings();
  if (!/^https:\/\//i.test(endpoint)) throw new Error('Некорректный адрес Java-компилятора. Открой настройки на странице «Практика».');
  const base = endpoint.replace(/\/+$/, '');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['X-Auth-Token'] = token;
  const payload = { source_code: sourceCode, language_id: 62, stdin, cpu_time_limit: 3, wall_time_limit: 8, memory_limit: 128000, max_processes_and_or_threads: 30 };
  const created = await fetch(`${base}/submissions/?base64_encoded=false&wait=false`, { method: 'POST', headers, body: JSON.stringify(payload) });
  if (!created.ok) {
    let detail = ''; try { detail = await created.text(); } catch {}
    throw new Error(`Сервер не принял программу (HTTP ${created.status}). ${detail.slice(0,220)}`);
  }
  const submission = await created.json();
  if (!submission.token) throw new Error('Сервис не вернул идентификатор запуска.');
  for (let attempt=0; attempt<24; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const poll = await fetch(`${base}/submissions/${encodeURIComponent(submission.token)}?base64_encoded=false`, { headers: token ? { 'X-Auth-Token': token } : {} });
    if (!poll.ok) throw new Error(`Не удалось получить результат (HTTP ${poll.status}).`);
    const result = await poll.json();
    const statusId = result.status?.id;
    if (statusId > 2) return { ...result, statusId, status: result.status?.description || 'Завершено', stdout: result.stdout || '', stderr: result.stderr || '', compileOutput: result.compile_output || '' };
  }
  throw new Error('Превышено время ожидания выполнения. Попробуй ещё раз.');
}

function renderExecution(result) {
  const good = result.statusId === 3;
  const output = result.stdout ? escapeHtml(result.stdout) : '(пустой вывод)';
  const details = result.compileOutput || result.stderr || result.message || '';
  return `<div class="console-head"><strong>${good?'Программа завершилась':'Статус: '+escapeHtml(result.status)}</strong><span>${escapeHtml(result.time || '—')} сек.</span></div><pre>${output}</pre>${details?`<pre class="console-error">${escapeHtml(details)}</pre>`:''}`;
}

function renderTestRun(run) {
  if (!run) return '';
  const details = (run.results || []).map((item,i)=>`<div class="test-result-row ${item.passed?'passed':'failed'}"><div><strong>${item.passed?'✓':'×'} ${escapeHtml(item.label || `Тест ${i+1}`)}</strong><small>${item.passed?'Вывод совпал с ожидаемым':escapeHtml(item.status || 'Результат отличается')}</small></div>${item.passed?'':`<div class="test-output-diff"><span>Ожидалось: ${escapeHtml(item.expected || '(пусто)')}</span><span>Получено: ${escapeHtml(item.actual || item.compileOutput || item.stderr || '(пусто)')}</span></div>`}</div>`).join('');
  return `<div class="tests-summary ${run.allPassed?'good':'bad'}"><strong>${run.passed} из ${run.total} тестов пройдено</strong><small>${escapeHtml(run.date || '')}</small></div>${details}`;
}
function exportData() {
  const payload = { app: 'Java Lab', version: '3.1', exportedAt: new Date().toISOString(), state }; // Настройки внешнего компилятора и токен не экспортируются
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = `java-lab-backup-${new Date().toISOString().slice(0,10)}.json`;
  link.click(); URL.revokeObjectURL(url);
}

// Global event wiring

document.querySelectorAll('.nav-item').forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
document.getElementById('mobile-menu').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));
document.getElementById('modal-close').addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', event => { if (event.target === modalBackdrop) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
document.getElementById('export-data').addEventListener('click', exportData);
document.getElementById('import-data').addEventListener('click', () => document.getElementById('import-file').click());
document.getElementById('import-file').addEventListener('change', async event => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const imported = parsed.state || parsed;
    if (!Array.isArray(imported.completedLessons) || !imported.taskStatus || typeof imported.taskStatus !== 'object') throw new Error('Файл не похож на резервную копию Java Lab.');
    if (!confirm('Заменить текущий прогресс данными из резервной копии?')) { event.target.value = ''; return; }
    state = { ...structuredClone(initialState), ...imported, completedLessons: Array.from(new Set([...(Array.isArray(imported.completedLessons) ? imported.completedLessons : []), 4].map(Number))).sort((a,b)=>a-b), taskNotes: imported.taskNotes || {}, reviewQueue: imported.reviewQueue || {}, walkthroughSeen: imported.walkthroughSeen || {}, walkthroughAvailable: imported.walkthroughAvailable || {}, archivedDrafts: imported.archivedDrafts || {}, studySessions: imported.studySessions || [], studySessionStartedAt: imported.studySessionStartedAt || null };
    persist(); renderView();
    alert('Прогресс восстановлен.');
  } catch (error) {
    alert(`Не удалось восстановить файл: ${error.message}`);
  } finally {
    event.target.value = '';
  }
});

updateSidebarProgress();
renderView();

/* Java Lab v3: detailed first-block learning, persistent notes and structured review. */
/* Java Lab v3: fuller lessons, guided practice, durable notes and spaced review. */
const V3_TASKS = [];
function addTask(id, lesson, title, description, starterCode, tests, hints, walkthrough) {
  V3_TASKS.push({id, lesson, title, difficulty:lesson===12?'Контрольная':'Базовая', description, starterCode, tests, hints, walkthrough});
}

// Lessons 5–12: expanded, plain-language explanations and three comprehension checks each.
const V3_DETAILS = {
5:{goal:'Научиться читать строку по символам, получать отдельный char и проверять каждый символ. Это основа для поиска и анализа текста.',theory:[
['String и char — разные вещи','String хранит последовательность символов, например "Java". char хранит один символ, например \'J\'. char пишется в одинарных кавычках, String — в двойных.'],
['Индексы начинаются с нуля','В строке "cat" индексы символов — 0, 1 и 2. Длина строки равна 3, но индекса 3 нет. Последний индекс всегда text.length() - 1.'],
['Получить символ через charAt','text.charAt(i) возвращает символ типа char на позиции i. Если запросить индекс вне диапазона от 0 до length() - 1, появится StringIndexOutOfBoundsException.'],
['Перебор строки циклом','Начни i с 0 и продолжай, пока i < text.length(). На каждом шаге обрабатывай text.charAt(i). Так каждый существующий символ будет просмотрен ровно один раз.'],
['Полезные проверки символов','Character.isDigit(ch) проверяет цифру, isLetter(ch) — букву, isWhitespace(ch) — пробельный символ. Они понятнее, чем длинная цепочка сравнений с отдельными цифрами.'],
['Строки неизменяемые','Методы toLowerCase() и replace() не меняют исходную строку, а возвращают новую. Если результат нужен дальше, сохрани его: text = text.toLowerCase().'],
['Счётчик создают до цикла','count = 0 объявляется один раз до цикла. Когда условие выполняется, count увеличивается на 1. Если объявить count внутри цикла, он будет обнуляться при каждом повторении.'],
['Почему здесь нельзя использовать % 10','В уроке while ты разбирал число: остаток от деления на 10 показывал последнюю цифру, а деление на 10 удаляло её. Строка — не число, поэтому этот приём к ней не подходит. У строки есть позиции: мы берём символ по индексу i через charAt(i) и двигаемся слева направо.'],
['Как читать проверку Character.isDigit','Метод получает один char и возвращает boolean: true, если символ является цифрой, и false в противном случае. Поэтому его удобно ставить в if. Сам метод не увеличивает count — счётчик меняешь ты внутри ветки if.'],
['Что происходит с пустой строкой','У пустой строки length() равно 0. Цикл for с i = 0 и условием i < text.length() не запустится ни разу. Это нормально: если мы считаем цифры, в пустом тексте их ноль.']
],code:'String text = "hello123";\nint count = 0;\nfor (int i = 0; i < text.length(); i++) {\n    char current = text.charAt(i);\n    if (Character.isDigit(current)) count++;\n}\nSystem.out.println(count); // 3',questions:[['Какой последний индекс у строки длины 5?','4: индексация начинается с нуля.'],['Что возвращает charAt(i)?','Один символ типа char на выбранной позиции.'],['Меняет ли toLowerCase() старую строку?','Нет, он возвращает новую строку. Её нужно сохранить, если она понадобится.']],quiz:[['У строки длиной 4 какие индексы существуют?',['1, 2, 3, 4','0, 1, 2, 3','0, 1, 2, 3, 4'],1,'Индексы начинаются с 0 и заканчиваются на 3.'],['Что делает Character.isDigit(ch)?',['Преобразует символ в число','Проверяет, является ли символ цифрой','Удаляет символ'],1,'Метод возвращает true или false в зависимости от того, цифра ли это.'],['Как безопасно пройти всю строку?',['i <= text.length()','i < text.length()','i < 0'],1,'При последнем существующем индексе i = length() - 1 условие ещё истинно.'] ]},
6:{goal:'Создавать массивы, заполнять их и обходить индексы без выхода за границы. Научиться искать максимум и выводить элементы в обратном порядке.',theory:[
['Что такое массив','Массив — это последовательность элементов одного типа. Например, int[] marks = new int[5] создаёт место для пяти целых чисел. Размер задаётся при создании.'],
['Создание и длина','int[] numbers = new int[n] создаёт массив длины n. У массива есть поле numbers.length — без круглых скобок. Для int элементы изначально равны нулю.'],
['Индексы массива','Индексы начинаются с 0, последний индекс равен length - 1. Обращение к numbers[n] при длине n выходит за границы и вызывает ArrayIndexOutOfBoundsException.'],
['Заполнение циклом','Чтобы заполнить массив, используй for от i = 0 до i < numbers.length. На каждой итерации считай одно значение и положи в numbers[i].'],
['Поиск максимума','Если массив не пустой, начни max с первого элемента numbers[0]. Затем сравни остальные значения. Не начинай с нуля: все элементы могут быть отрицательными.'],
['Обратный обход','Чтобы вывести элементы наоборот, начни с numbers.length - 1 и уменьшай индекс до 0. Это меняет только порядок вывода, сам массив остаётся прежним.'],
['Проверяй границы','Перед циклом выпиши первый и последний индекс. Самые частые ошибки: начать с 1 и пропустить первый элемент, обратиться к индексу length, забыть включить индекс 0 при обратном обходе.']
],code:'int[] numbers = {4, 9, -2, 7};\nint max = numbers[0];\nfor (int i = 1; i < numbers.length; i++) {\n    if (numbers[i] > max) max = numbers[i];\n}\nSystem.out.println(max); // 9',questions:[['Какой последний индекс у массива длины 6?','5, то есть length - 1.'],['Как получить длину массива?','Через поле numbers.length, без скобок.'],['Почему max начинают с numbers[0]?','Так корректно обрабатываются массивы, в которых все значения отрицательные.']],quiz:[['Какой индекс у последнего элемента длины 8?',['8','7','6'],1,'Последний индекс — 8 - 1.'],['Как узнать длину массива?',['numbers.length()','numbers.size','numbers.length'],2,'У массива length — поле, у String length() — метод.'],['С чего начать max для [-5, -2, -9]?',['С 0','С numbers[0]','С numbers.length'],1,'Ноль не является элементом массива и может исказить максимум.']]},
7:{goal:'Выносить действия в методы, передавать данные через параметры и получать ответ через return. Научиться делить большую программу на небольшие понятные части.',theory:[
['Зачем нужны методы','Метод даёт имя отдельному действию. Вместо повторения одного и того же кода можно вызвать метод несколько раз. Хороший метод решает одну понятную задачу.'],
['Из чего состоит объявление','В public static int sum(int a, int b) слово int задаёт тип результата, sum — имя, а a и b — параметры. Параметры принимают данные при вызове метода.'],
['Параметры и аргументы','Параметры указаны в объявлении метода. Аргументы — реальные значения в вызове: sum(3, 5). Внутри метода параметры работают как локальные переменные.'],
['return и void','return завершает метод и возвращает значение. Если метод ничего не возвращает, указывают void. Тип результата должен соответствовать тому, что возвращается.'],
['Область видимости','Переменная, созданная внутри метода, доступна только в своей области. Переменные main не становятся видимыми автоматически в другом методе — передавай нужные значения параметрами.'],
['Разделяй ввод, вычисление и вывод','Часто main отвечает за чтение и печать, а отдельный метод — за вычисление. Так проще проверять логику и повторно использовать её.'],
['Не выноси каждую строку','Метод нужен для осмысленного действия, а не для механического дробления. Название должно объяснять, что делает код: calculateTotal, isEven, findMax.']
],code:'public static int maxOfThree(int a, int b, int c) {\n    int max = a;\n    if (b > max) max = b;\n    if (c > max) max = c;\n    return max;\n}',questions:[['Что означает int перед именем метода?','Метод возвращает целое число.'],['Для чего нужны параметры?','Чтобы передать методу данные, с которыми он должен работать.'],['Чем return отличается от println?','return передаёт значение месту вызова, println только выводит текст в консоль.']],quiz:[['Как объявить метод, который возвращает true или false?',['void check()','boolean check()','int check()'],1,'Логический тип результата — boolean.'],['Что делает return result?',['Возвращает значение и завершает метод','Только печатает значение','Создаёт переменную'],0,'return возвращает значение вызывающему коду.'],['Где видна локальная переменная метода?',['Во всём проекте','В своей области видимости','Во всех классах'],1,'Локальная переменная ограничена блоком, в котором объявлена.']]},
8:{goal:'Читать ввод через Scanner, понимать разницу между чтением слова и строки, проверять ввод и создавать простое меню с switch.',theory:[
['Что делает Scanner','Scanner читает данные из источника. Для консоли обычно используют new Scanner(System.in). nextInt() читает int, next() — одно слово, nextLine() — всю оставшуюся строку.'],
['next и nextLine','next() останавливается на пробеле. nextLine() читает до конца строки и сохраняет пробелы. Если после nextInt() сразу вызвать nextLine(), он может прочитать только остаток текущей строки.'],
['Проверка пользовательского ввода','Не считай любое введённое значение допустимым. Проверяй диапазон и явно обрабатывай некорректное значение. Например, номер месяца должен быть от 1 до 12.'],
['switch для фиксированного меню','switch выбирает ветку по значению выражения. case описывает конкретный вариант, break завершает ветку, default обрабатывает значения, для которых case не найден.'],
['if или switch','if удобнее для диапазонов и составных логических условий. switch удобнее для конечного набора фиксированных вариантов, например пунктов меню.'],
['Порядок чтения важен','Если условие говорит: сначала номер операции, затем два числа, читай их именно в этом порядке. Иначе программа будет вычислять не те данные.'],
['Ошибки в меню','Не забывай break, иначе выполнение может перейти к следующей ветке. Не оставляй default без обработки, если неправильный выбор должен быть заметен пользователю.']
],code:'switch (choice) {\n    case 1:\n        System.out.println(a + b);\n        break;\n    case 2:\n        System.out.println(a - b);\n        break;\n    default:\n        System.out.println("Неизвестная операция");\n}',questions:[['Чем nextLine() отличается от next()?','nextLine() читает строку с пробелами; next() читает один токен.'],['Для чего нужен default?','Для обработки значений, которые не совпали ни с одним case.'],['Когда switch удобнее if?','Когда выбираем один вариант из фиксированного набора значений.']],quiz:[['Какой метод читает строку с пробелами?',['next()','nextLine()','nextInt()'],1,'nextLine() читает до конца строки.'],['Если case не подошёл, что может сработать?',['default','Первый case','Никакая ветка всегда'],0,'default — ветка для остальных значений.'],['Что уместнее для меню 1/2/3?',['switch','while без условия','try/catch'],0,'switch описывает выбор из фиксированного набора.']]},
9:{goal:'Научиться различать ошибки компиляции, выполнения и логики, читать stack trace и использовать breakpoint в IntelliJ IDEA.',theory:[
['Три вида ошибок','Синтаксическая ошибка мешает компиляции. Ошибка времени выполнения появляется во время запуска, например выход за границы массива. Логическая ошибка даёт неправильный результат, хотя программа запускается.'],
['Что показывает stack trace','Stack trace — цепочка вызовов в момент исключения. Ищи тип ошибки, сообщение и строку в своём коде, например Main.java:12. Начинай с первого участка стека, который относится к твоему файлу.'],
['Сообщение компилятора','Компилятор указывает файл и место, где заметил проблему. Но причина иногда находится строкой выше: пропущенная скобка может заставить его жаловаться на следующую инструкцию.'],
['Breakpoint','Breakpoint — точка остановки. Поставь её на строке, которую хочешь исследовать, и запусти Debug. Программа остановится, чтобы ты мог посмотреть значения переменных.'],
['Step Over и Step Into','Step Over выполняет текущую строку и переходит к следующей. Step Into заходит внутрь вызываемого метода. Для начала достаточно ставить точку остановки и наблюдать, как меняются счётчик и накопитель.'],
['Минимизируй проблему','Если не можешь найти ошибку, временно убери лишний код и оставь короткий пример, который воспроизводит проблему. Чем меньше частей, тем легче локализовать причину.'],
['Проверь исправление','После исправления повтори тест, на котором программа падала, и добавь граничный тест. Не считай ошибку исправленной, пока результат не проверен.']
],code:'int sum = 0;\nfor (int i = 0; i < 3; i++) {\n    sum += i;\n    System.out.println("i=" + i + ", sum=" + sum);\n}',questions:[['Что показывает stack trace?','Цепочку вызовов и место, где возникло исключение.'],['Для чего нужен breakpoint?','Чтобы остановить программу и посмотреть значения переменных в выбранном месте.'],['Чем логическая ошибка отличается от ошибки компиляции?','Логическая ошибка позволяет запустить программу, но ответ неверен; ошибка компиляции не даёт собрать код.']],quiz:[['Программа работает, но выводит неверную сумму. Это…',['Логическая ошибка','Синтаксическая ошибка','Проблема установки JDK'],0,'Код запустился, но алгоритм неверен.'],['Что полезно найти в stack trace?',['Название темы IDE','Тип исключения и строку своего кода','Цвет редактора'],1,'Стек помогает найти место и цепочку вызовов.'],['Что делает breakpoint?',['Исправляет строку','Останавливает программу в выбранной точке','Удаляет переменную'],1,'Остановка нужна для просмотра состояния программы.']]},
10:{goal:'Собрать консольную игру из переменных, условий, циклов и ввода; понять состояние игры, попытки и момент завершения.',theory:[
['Сначала план игры','Любую игру можно разделить на этапы: подготовить секретное значение, получить ввод, проверить догадку, показать ответ и решить, продолжать ли игру.'],
['Состояние игры','Секретное число и число оставшихся попыток — состояние. Переменные хранят это состояние между итерациями цикла. Не объявляй счётчик попыток внутри цикла, если хочешь сохранить его значение.'],
['Одна попытка или несколько','Для одной попытки хватит if/else. Для нескольких попыток нужен цикл. Условие цикла должно учитывать лимит попыток или факт победы.'],
['Остановка через break','После правильной догадки продолжать спрашивать числа не нужно. break завершает ближайший цикл. Используй его только там, где дальнейшие итерации действительно не нужны.'],
['Случайность и тесты','В учебных проверках число фиксируем, чтобы результат был воспроизводимым. Позже добавим Random, когда разберём, как тестировать случайное поведение.'],
['Что проверить','Победу с первой попытки, победу после ошибки, отсутствие победы и минимальный лимит попыток. Каждый сценарий должен иметь понятный итог.'],
['Готовность мини-проекта','Программа должна корректно читать ввод, останавливаться после победы, не делать лишних попыток и ясно сообщать результат.']
],code:'int secretNumber = 7;\nint foundAt = -1;\nfor (int attempt = 1; attempt <= 3; attempt++) {\n    int guess = scanner.nextInt();\n    if (guess == secretNumber) {\n        foundAt = attempt;\n        break;\n    }\n}',questions:[['Зачем хранить секретное число в переменной?','Чтобы сравнивать с ним каждую догадку и не дублировать значение.'],['Что делает break после победы?','Немедленно завершает цикл попыток.'],['Зачем фиксировать секретное число в автотестах?','Чтобы поведение программы было предсказуемым и ожидаемый результат можно было проверить.']],quiz:[['Для нескольких попыток удобнее…',['Цикл','Один println','Только переменная'],0,'Цикл повторяет ввод и проверку.'],['Когда нужен break?',['После правильной догадки','Перед первой попыткой','Всегда в начале'],0,'После победы дальнейшие попытки не нужны.'],['Почему тестам полезно фиксированное число?',['Оно меняет синтаксис','Тест знает ожидаемое поведение','Оно отменяет ввод'],1,'Детерминированный ввод делает проверку повторяемой.']]},
11:{goal:'Сделать небольшой анализатор текста: пройти строку, посчитать подходящие символы и разделить текст на слова.',theory:[
['Сначала уточни определение','В задаче должно быть ясно, что считается словом или гласной: учитываем ли регистр, пробелы, дефисы и знаки препинания. Не добавляй свои правила — следуй условию.'],
['Один регистр','toLowerCase() возвращает новую строку в нижнем регистре. Это избавляет от отдельной проверки для заглавных и строчных букв.'],
['Перебор строки','Цикл по индексам позволяет рассмотреть каждый символ. Так строятся подсчёт гласных, цифр, пробелов и поиск определённого символа.'],
['split и массив слов','split(regex) делит строку по регулярному выражению и возвращает String[]. Выражение \\s+ означает один или более пробельных символов. В строковом литерале Java обратный слеш удваивается.'],
['Пустая строка','После trim() строка, состоящая только из пробелов, станет пустой. Проверяй isEmpty() до split, иначе пустой ввод может быть обработан неверно.'],
['Линейный проход','Если каждый символ проверяется один раз, количество действий примерно пропорционально длине строки: O(n). На этом уровне важно понять, что один проход по строке масштабируется линейно.'],
['Разделяй шаги','Сначала прочитай строку целиком, затем обработай её, после чего выведи итог. Позже вынесем обработку в отдельные методы.']
],code:'String text = "Java".toLowerCase();\nString vowels = "аеёиоуыэюяaeiou";\nint count = 0;\nfor (int i = 0; i < text.length(); i++) {\n    if (vowels.indexOf(text.charAt(i)) >= 0) count++;\n}',questions:[['Зачем вызывать toLowerCase()?','Чтобы не проверять отдельно прописные и строчные буквы.'],['Что возвращает split()?','Массив частей строки.'],['Почему нужно проверить пустой текст отдельно?','Чтобы корректно вывести 0 слов, а не считать пустой ввод обычным словом.']],quiz:[['Что возвращает split("\\\\s+")?',['Число символов','Массив частей строки','Один символ'],1,'split возвращает массив String[].'],['Что делает trim()?',['Удаляет пробелы по краям','Делает буквы заглавными','Считает гласные'],0,'После trim() строка только из пробелов станет пустой.'],['Сколько раз проверяется символ в простом проходе?',['Примерно один раз на символ','Всегда один раз','Квадрат длины'],0,'Один проход требует линейного числа шагов.']]},
12:{goal:'Проверить, умеешь ли ты самостоятельно сочетать массивы, строки, циклы, условия и накопители. В контрольной три новые задачи без подсказок.',theory:[
['Это проверка навыка, а не новая тема','Нужно начать с пустого файла: понять ввод и вывод, выбрать переменные, построить цикл и проверить результат. Не ищи одну специальную конструкцию — используй то, что уже изучил.'],
['Перескажи условие','Своими словами выпиши, какие данные поступают, что нужно найти и что вывести. Отметь ограничения, пустые случаи и повторяющиеся значения.'],
['Придумай маленький пример','Возьми небольшой массив или короткую строку. Пройди алгоритм руками и запиши, как меняются count, sum, left и right.'],
['Разбей на шаги','Ввод → подготовка данных → цикл → условие → обновление результата → вывод. Каждый шаг можно проверить отдельно.'],
['Проверь границы','Один элемент, ни одного совпадения, все элементы подходят, отрицательные числа, повторяющиеся значения и строка из одного символа.'],
['Объясни код','После тестирования проговори, что хранит каждая переменная, сколько раз работает цикл и почему условие верно. Если не можешь объяснить строку, навык ещё не закреплён.'],
['Правило контрольной','Подсказок нет. Если застрял, сделай паузу и попробуй снова. Пошаговый разбор появится после неудачной проверки; просмотр решения отправит задачу на повтор через 2 дня.']
],code:'// Перед кодом ответь себе:\n// 1. Что читаю?\n// 2. Что нужно хранить?\n// 3. Что повторяется в цикле?\n// 4. Какое условие проверяется?\n// 5. Что и в каком формате вывести?',questions:[['Что нужно сделать до кода?','Пересказать условие, выделить вход и выход и вручную разобрать маленький пример.'],['Где объявить накопитель?','Обычно до цикла, чтобы он сохранялся между итерациями.'],['Что делать после неудачного теста?','Сравнить ожидаемый и фактический вывод, пройти тест вручную, найти место ошибки и проверить границы.']],quiz:[['Где объявляют счётчик совпадений?',['До цикла','Внутри if','После вывода'],0,'Так значение будет накапливаться от итерации к итерации.'],['Что проверить после обычного примера?',['Только внешний вид','Граничные случаи и отсутствие совпадений','Только самый большой ввод'],1,'Ошибки часто находятся на границах.'],['Когда навык закреплён?',['После просмотра решения','После одной компиляции','Когда решил сам и можешь объяснить шаги'],2,'Важно уметь воспроизвести решение без готового кода.']]}
};
Object.assign(LESSON_DETAILS, V3_DETAILS);
// Lessons 5–12 are authored as compact tuples [question, options, correctIndex, explanation].
// The lesson renderer uses named fields; normalize once so later lessons open just like lesson 4.
Object.entries(V3_DETAILS).forEach(([lessonId, detail]) => {
  if (Array.isArray(detail.quiz)) {
    detail.quiz = detail.quiz.map(item => Array.isArray(item)
      ? ({ q: item[0], options: item[1], correct: item[2], why: item[3] })
      : item);
  }
});

// Extra foundational explanations: number limits and safe numeric expressions.
LESSON_DETAILS[1].theory.push(
  ['Целочисленное деление и остаток', 'Если оба операнда имеют тип int, Java выполняет целочисленное деление: 7 / 2 даст 3, а не 3.5. Остаток от деления берётся оператором %. Например, 7 % 2 равно 1. Чтобы получить дробный результат, один операнд должен быть double: 7.0 / 2 даст 3.5.'],
  ['Диапазон int и переполнение', 'Тип int хранит значения от -2 147 483 648 до 2 147 483 647. Если прибавить 1 к Integer.MAX_VALUE, число не станет больше: оно перейдёт к минимальному отрицательному значению. Это называется переполнением. Если по условию возможны большие значения, используй long и проверяй, помещается ли результат даже в long.'],
  ['Преобразование типов', 'Java не всегда позволяет смешивать типы без явного преобразования. Например, double average = (double) sum / count; сначала превращает sum в double, поэтому деление сохраняет дробную часть. Если сначала разделить два int, а потом записать результат в double, потерянная дробная часть уже не вернётся.']
);
LESSON_DETAILS[1].questions.push(
  ['Что выведет int x = 7 / 2; System.out.println(x)?', '3: при делении int на int дробная часть отбрасывается.'],
  ['Что произойдёт при Integer.MAX_VALUE + 1 для типа int?', 'Значение переполнится и перейдёт к -2 147 483 648. Для больших диапазонов используют long.'],
  ['Почему (double) sum / count отличается от (double) (sum / count)?', 'В первом случае деление выполняется как double. Во втором сначала выполняется целочисленное деление, и дробная часть теряется до преобразования.']
);

function walk(idea, steps, trace, pitfalls, solution) { return {idea,steps,trace,pitfalls,solution}; }

// Lesson 5 — strings and characters.
addTask('t5-count-digits',5,'Подсчёт цифр в строке','Введи одну строку и выведи, сколько символов в ней являются цифрами. Буквы, пробелы и знаки препинания не считай.',
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        // Посчитай цифры в строке
    }
}`,
[{input:'hello123world45\n',expected:'5',label:'Цифры в середине и в конце'},{input:'abc\n',expected:'0',label:'Цифр нет'},{input:'a0b9\n',expected:'2',label:'Две цифры'},{input:'\n',expected:'0',label:'Пустая строка'}],
['Вспомни, как пройти индексы от 0 до text.length() - 1.','charAt(i) получает символ, а Character.isDigit(...) проверяет, является ли он цифрой.','Создай count = 0 до цикла. Увеличивай его только при цифре.'],
walk('Строка — последовательность символов. Проверь каждый символ и увеличивай счётчик только для цифр.',['Объяви count = 0 до цикла.','Пройди строку индексами от 0 до length() - 1.','Получи символ через char current = text.charAt(i).','Если Character.isDigit(current) вернул true, увеличь count.','После цикла выведи count. Для пустой строки цикл не выполнится, ответ будет 0.'],[['Индекс','Символ','Цифра?','count'],['0','h','нет','0'],['5','1','да','1'],['6','2','да','2'],['7','3','да','3'],['12','4','да','4'],['13','5','да','5']],['Объявить count внутри цикла — он будет обнуляться.','Вызвать charAt(text.length()) — такого индекса нет.','Сравнивать символ с числом вместо Character.isDigit().'],
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        int count = 0;
        for (int i = 0; i < text.length(); i++) {
            if (Character.isDigit(text.charAt(i))) count++;
        }
        System.out.println(count);
    }
}`));

addTask('t5-reverse-string',5,'Разворот строки','Прочитай строку и выведи её символы в обратном порядке. Например, Java превращается в avaJ. Пробелы тоже сохраняй.',
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        // Выведи строку в обратном порядке
    }
}`,
[{input:'Java\n',expected:'avaJ',label:'Обычная строка'},{input:'a\n',expected:'a',label:'Один символ'},{input:'cat\n',expected:'tac',label:'Три символа'},{input:'\n',expected:'',label:'Пустая строка'}],
['Последний символ находится по индексу text.length() - 1.','Начни цикл с последнего индекса и двигайся к нулю.','Уменьшай i на 1 и печатай text.charAt(i).'],
walk('Чтобы вывести строку наоборот, не нужно менять её внутри. Просто обойди индексы в обратном направлении.',['Начни i = text.length() - 1.','Продолжай, пока i >= 0.','После каждой итерации выполняй i--.','Печатай text.charAt(i) через System.out.print.','Для пустой строки начальный индекс будет -1, поэтому цикл сразу завершится.'],[['text','Индексы','Порядок вывода'],['Java','0:J, 1:a, 2:v, 3:a','a → v → a → J']],['Начать с text.length(): это индекс за пределами строки.','Поставить i > 0 и пропустить индекс 0.','Увеличивать i вместо уменьшения.'],
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        for (int i = text.length() - 1; i >= 0; i--) {
            System.out.print(text.charAt(i));
        }
        System.out.println();
    }
}`));

// Lesson 6 — arrays.
addTask('t6-max-array',6,'Максимум в массиве','Введи N, затем N целых чисел. Выведи наибольшее число. По условию N не меньше 1.',
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] numbers = new int[n];
        // Считай элементы и найди максимум
    }
}`,
[{input:'5\n4 9 -2 7 3\n',expected:'9',label:'Положительный максимум'},{input:'1\n-5\n',expected:'-5',label:'Один отрицательный элемент'},{input:'4\n-3 -8 -1 -4\n',expected:'-1',label:'Все числа отрицательные'}],
['Сначала заполни массив циклом.','Не начинай max с нуля: все числа могут быть отрицательными.','Положи в max numbers[0], затем сравни остальные элементы начиная с индекса 1.'],
walk('Максимум — наибольшее из просмотренных значений. Сравни очередной элемент с текущим max.',['Заполни массив.','Положи numbers[0] в max.','Начни второй цикл с i = 1: первый элемент уже учтён.','Если numbers[i] > max, присвой max новое значение.','После цикла выведи max.'],[['Элемент','max после проверки','Что произошло'],['4','4','Начальное значение'],['9','9','9 больше 4'],['-2','9','не больше 9'],['7','9','не больше 9'],['3','9','не больше 9']],['max = 0 даст ошибку, если все числа отрицательные.','Индекс n не существует: последний индекс n - 1.','Не забудь заполнить массив до поиска.'],
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) numbers[i] = scanner.nextInt();
        int max = numbers[0];
        for (int i = 1; i < n; i++) {
            if (numbers[i] > max) max = numbers[i];
        }
        System.out.println(max);
    }
}`));

addTask('t6-reverse-array',6,'Вывести массив в обратном порядке','Введи N и N целых чисел. Выведи их в обратном порядке через один пробел.',
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] numbers = new int[n];
        // Заполни массив и выведи наоборот
    }
}`,
[{input:'4\n10 20 30 40\n',expected:'40 30 20 10',label:'Четыре элемента'},{input:'1\n7\n',expected:'7',label:'Один элемент'},{input:'3\n-1 0 5\n',expected:'5 0 -1',label:'Отрицательное и ноль'}],
['Последний индекс равен n - 1.','Начни второй цикл с n - 1 и двигайся вниз до 0.','Печатай пробел после значения только если i > 0.'],
walk('Для обратного вывода не обязательно менять массив: достаточно пройти индексы от последнего к первому.',['Считай массив.','Поставь i = n - 1.','Пока i >= 0, печатай numbers[i].','После вывода значения добавляй пробел, если i > 0.','Уменьшай i на 1.'],[['Индекс','Значение','Накопленный вывод'],['3','40','40'],['2','30','40 30'],['1','20','40 30 20'],['0','10','40 30 20 10']],['Начать с n, хотя последний индекс — n - 1.','Поставить i > 0 и забыть нулевой индекс.','Перепутать обратный порядок вывода с изменением самого массива.'],
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) numbers[i] = scanner.nextInt();
        for (int i = n - 1; i >= 0; i--) {
            System.out.print(numbers[i]);
            if (i > 0) System.out.print(" ");
        }
        System.out.println();
    }
}`));

// Lesson 7 — methods.
addTask('t7-is-even',7,'Метод проверки чётности','Напиши метод isEven(int number), который возвращает true для чётного числа и false для нечётного. В main прочитай число и выведи результат.',
`import java.util.Scanner;
public class Main {
    public static boolean isEven(int number) {
        // Верни true или false
        return false;
    }
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int number = scanner.nextInt();
        System.out.println(isEven(number));
    }
}`,
[{input:'8\n',expected:'true',label:'Положительное чётное'},{input:'7\n',expected:'false',label:'Нечётное'},{input:'0\n',expected:'true',label:'Ноль чётный'},{input:'-4\n',expected:'true',label:'Отрицательное чётное'}],
['Метод должен возвращать boolean, а не печатать ответ.','Остаток чётного числа от деления на 2 равен нулю.','Выражение number % 2 == 0 уже имеет тип boolean — его можно вернуть.'],
walk('Метод получает number через параметр и возвращает логический ответ. Чётность проверяется остатком от деления на 2.',['Объяви public static boolean isEven(int number).','Проверь number % 2 == 0.','Верни результат через return.','В main вызови isEven(number) и выведи результат.'],[['number','Остаток','Ответ'],['8','0','true'],['7','1','false'],['-4','0','true']],['Напечатать результат, но ничего не вернуть.','Забыть return.','Считать, что отрицательные числа не бывают чётными.'],
`import java.util.Scanner;
public class Main {
    public static boolean isEven(int number) { return number % 2 == 0; }
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int number = scanner.nextInt();
        System.out.println(isEven(number));
    }
}`));

addTask('t7-max-three',7,'Максимум из трёх чисел через метод','Создай maxOfThree(int a, int b, int c), который возвращает наибольшее из трёх чисел.',
`import java.util.Scanner;
public class Main {
    public static int maxOfThree(int a, int b, int c) {
        // Найди и верни максимум
        return a;
    }
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt(), b = scanner.nextInt(), c = scanner.nextInt();
        System.out.println(maxOfThree(a, b, c));
    }
}`,
[{input:'3 9 5\n',expected:'9',label:'Максимум посередине'},{input:'-3 -8 -1\n',expected:'-1',label:'Все отрицательные'},{input:'7 7 2\n',expected:'7',label:'Есть равные'}],
['Метод принимает три параметра и возвращает int.','Начни с max = a.','Двумя отдельными if сравни b и c с текущим max.'],
walk('Начни с первого значения как с максимума, затем проверь два оставшихся.',['Создай int max = a.','Если b > max, присвой max = b.','Если c > max, присвой max = c.','Верни max.','В main выведи результат вызова метода.'],[['Шаг','max','Проверка'],['Начало','3','Берём a'],['b','9','9 > 3: обновляем'],['c','9','5 > 9: нет']],['Инициализировать max нулём — ошибка для отрицательных чисел.','Использовать else if вместо двух независимых проверок.','Забыть вернуть max.'],
`import java.util.Scanner;
public class Main {
    public static int maxOfThree(int a, int b, int c) {
        int max = a;
        if (b > max) max = b;
        if (c > max) max = c;
        return max;
    }
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt(), b = scanner.nextInt(), c = scanner.nextInt();
        System.out.println(maxOfThree(a, b, c));
    }
}`));

// Lesson 8 — Scanner and switch.
addTask('t8-calculator',8,'Калькулятор с меню switch','Введи номер операции, a и b. 1 — сложение, 2 — вычитание, 3 — умножение. Для другого номера выведи «Неизвестная операция».',
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int choice = scanner.nextInt();
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        // Реализуй меню через switch
    }
}`,
[{input:'1 8 2\n',expected:'10',label:'Сложение'},{input:'2 8 3\n',expected:'5',label:'Вычитание'},{input:'3 4 5\n',expected:'20',label:'Умножение'},{input:'9 1 2\n',expected:'Неизвестная операция',label:'Неизвестный пункт'}],
['Сначала прочитай choice, a и b.','Используй switch (choice) и отдельный case для каждой операции.','Не забудь break после каждого case и default для остальных значений.'],
walk('switch выбирает одну ветку по фиксированному значению — это удобно для простого меню.',['Прочитай номер операции и операнды.','Для case 1 выведи a + b, затем break.','Для case 2 выведи a - b, затем break.','Для case 3 выведи a * b, затем break.','В default выведи сообщение о неизвестной операции.'],[['choice','Ветка','Результат при a=8,b=2'],['1','case 1','10'],['2','case 2','6'],['3','case 3','16'],['9','default','Неизвестная операция']],['Забыть break и случайно перейти к следующей ветке.','Не обработать неизвестный номер.','Считать входные данные в неправильном порядке.'],
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int choice = scanner.nextInt(), a = scanner.nextInt(), b = scanner.nextInt();
        switch (choice) {
            case 1: System.out.println(a + b); break;
            case 2: System.out.println(a - b); break;
            case 3: System.out.println(a * b); break;
            default: System.out.println("Неизвестная операция");
        }
    }
}`));

addTask('t8-month-days',8,'Количество дней в месяце','Введи номер месяца от 1 до 12. Выведи количество дней, считая февраль равным 28 дням. Для некорректного номера выведи -1.',
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int month = scanner.nextInt();
        // Определи количество дней через switch
    }
}`,
[{input:'2\n',expected:'28',label:'Февраль'},{input:'4\n',expected:'30',label:'Апрель'},{input:'12\n',expected:'31',label:'Декабрь'},{input:'13\n',expected:'-1',label:'Некорректный номер'}],
['Месяцы 4, 6, 9 и 11 имеют 30 дней.','Февраль — отдельный case со значением 28.','Сначала проверь, что номер находится от 1 до 12; иначе default может ошибочно выдать 31.'],
walk('switch группирует месяцы с одинаковым количеством дней. Проверку диапазона лучше выполнить до switch.',['Прочитай month.','Если month < 1 или month > 12, выведи -1 и заверши main.','Для case 2 выведи 28.','Для case 4, 6, 9, 11 выведи 30.','Для оставшихся допустимых месяцев выведи 31.'],[['month','Ветка','Дней'],['2','case 2','28'],['4','case 4/6/9/11','30'],['12','default после проверки','31'],['13','проверка диапазона','-1']],['Сразу использовать default = 31 без проверки диапазона.','Забыть один из месяцев с 30 днями.','Учитывать високосность, хотя условие требует всегда 28 дней в феврале.'],
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int month = scanner.nextInt();
        if (month < 1 || month > 12) { System.out.println(-1); return; }
        switch (month) {
            case 2: System.out.println(28); break;
            case 4: case 6: case 9: case 11: System.out.println(30); break;
            default: System.out.println(31);
        }
    }
}`));

// Lesson 9 — debugging and error reading.
addTask('t9-average',9,'Исправь вычисление среднего','Стартовый код должен вывести среднее арифметическое N чисел. Исправь ошибку: дробная часть теряется при делении int на int.',
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int sum = 0;
        for (int i = 0; i < n; i++) sum += scanner.nextInt();
        double average = sum / n; // Найди и исправь ошибку
        System.out.println(average);
    }
}`,
[{input:'2\n2 3\n',expected:'2.5',label:'Среднее с дробной частью'},{input:'4\n1 2 3 4\n',expected:'2.5',label:'Четыре числа'},{input:'3\n3 3 3\n',expected:'3.0',label:'Целое среднее'}],
['Посмотри на типы sum и n. Что возвращает деление int на int?','Переменная double слева не меняет тип уже вычисленного выражения справа.','Преобразуй один из операндов ДО деления: (double) sum / n.'],
walk('Тип выражения зависит от типов его операндов. int / int сначала отбрасывает дробную часть, даже если результат записывается в double.',['Для входа 2 и 3 сумма равна 5, количество — 2.','sum / n — это int / int, поэтому 5 / 2 даёт 2.','Затем 2 превращается в double и сохраняется как 2.0. Потерянная дробь уже не появится.','Преобразуй sum до деления: (double) sum / n.','Теперь деление выполняется как double, и ответ равен 2.5.'],[['Выражение','Результат'],['5 / 2','2'],['double average = 5 / 2','2.0'],['(double) 5 / 2','2.5']],['Считать, что тип double слева автоматически меняет выражение справа.','Писать (double) (sum / n): преобразование всё ещё происходит после деления.','Не тестировать пример с нецелым средним.'],
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt(), sum = 0;
        for (int i = 0; i < n; i++) sum += scanner.nextInt();
        double average = (double) sum / n;
        System.out.println(average);
    }
}`));

addTask('t9-off-by-one',9,'Найди ошибку границы цикла','Программа должна вывести числа от 1 до N включительно через пробел. Сейчас в выводе есть лишний ноль. Исправь цикл.',
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        for (int i = 0; i <= n; i++) { // Здесь ошибка
            System.out.print(i);
            if (i < n) System.out.print(" ");
        }
    }
}`,
[{input:'3\n',expected:'1 2 3',label:'N = 3'},{input:'1\n',expected:'1',label:'Минимальный случай'},{input:'5\n',expected:'1 2 3 4 5',label:'Пять чисел'}],
['Выпиши ожидаемые значения для N = 3.','Первое значение счётчика должно быть 1, последнее — N.','Проверь начало и условие: for (int i = 1; i <= n; i++).'],
walk('Ошибка на единицу обычно появляется из-за неправильного начального значения или условия остановки. Сверь диапазон цикла с условием задачи.',['Для N = 3 ожидаются 1, 2, 3.','Текущий цикл начинается с 0 — поэтому лишний ноль появляется первым.','Начни с i = 1.','Оставь условие i <= n, чтобы включить N.','После каждой итерации увеличивай i на 1.'],[['Итерация','Старый i','Правильный i'],['1','0','1'],['2','1','2'],['3','2','3'],['4','3','цикл завершён после 3']],['i < n исключит N, если N нужно включить.','i = 0 добавляет лишний ноль.','Не проверять цикл на N = 1.'],
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        for (int i = 1; i <= n; i++) {
            System.out.print(i);
            if (i < n) System.out.print(" ");
        }
        System.out.println();
    }
}`));

// ===== Java Lab v3 additions: tasks, study explanations, progress, notes and review =====

// Legacy lesson-12 control task definitions are retained in the appended migration layer.
// Java Lab v3.2 presents exactly two active tasks per lesson; the first control attempt stays hint-free.
addTask('t10-guess-one',10,'Угадай число за одну попытку','Программа получает секретное число и догадку. Выведи «Угадал», если числа равны, иначе выведи «Не угадал». Ввод: сначала secret, затем guess.',
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int secret = scanner.nextInt();
        int guess = scanner.nextInt();
        // Сравни числа и выведи результат
    }
}`,
[{input:'7 7\n',expected:'Угадал',label:'Числа совпадают'},{input:'7 5\n',expected:'Не угадал',label:'Числа разные'},{input:'-3 -3\n',expected:'Угадал',label:'Отрицательное число'}],
['Какие два значения нужно сравнить?','Используй оператор ==: он проверяет, равны ли два значения int.','Сделай if/else: одна ветка для равенства, другая — для всех остальных случаев.'],
walk('Это маленькая модель проверки догадки. Пока у нас только одна попытка, поэтому цикл не нужен: достаточно сравнить два числа один раз.',['Считать secret — число, которое нужно угадать.','Считать guess — введённую догадку.','Проверить secret == guess.','Если условие истинно, вывести «Угадал». Иначе вывести «Не угадал».'],[['secret','guess','secret == guess','Вывод'],['7','7','true','Угадал'],['7','5','false','Не угадал'],['-3','-3','true','Угадал']],['Не перепутать == и =: первое сравнивает, второе присваивает.','Не выводить оба сообщения сразу — нужен if/else.','Соблюдать точный текст результата, включая пробелы и регистр.'],
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int secret = scanner.nextInt();
        int guess = scanner.nextInt();
        if (secret == guess) {
            System.out.println("Угадал");
        } else {
            System.out.println("Не угадал");
        }
    }
}`));

addTask('t10-guess-loop',10,'Игра «Угадай число» с тремя попытками','Секретное число равно 7. Прочитай до трёх догадок. Если игрок ввёл 7, выведи «Победа» и больше не читай числа. Если за три попытки число не угадано, выведи «Попытки закончились».',
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int secret = 7;
        boolean guessed = false;
        // Добавь цикл максимум на три попытки
    }
}`,
[{input:'7\n',expected:'Победа',label:'Победа с первой попытки'},{input:'2\n7\n',expected:'Победа',label:'Победа со второй попытки'},{input:'1\n2\n3\n',expected:'Попытки закончились',label:'Все три попытки неверные'}],
['Создай цикл, который делает не более трёх повторений.','В каждой итерации считывай одну догадку и сравнивай её с secret.','При совпадении установи guessed = true и выйди из цикла через break. После цикла проверь guessed.'],
walk('Нужно сохранить состояние «угадал или нет» между итерациями. Переменная guessed начинает с false и меняется на true только при правильной догадке.',['Объяви guessed до цикла, иначе на каждой итерации она будет сбрасываться.','Запусти for от 1 до 3 включительно.','Считай догадку внутри цикла.','Если догадка равна secret, выведи «Победа», присвой guessed = true и выполни break.','После цикла, если guessed всё ещё false, выведи «Попытки закончились».'],[['Попытка','Ввод','guessed после проверки'],['1','2','false'],['2','7','true, цикл прерывается'],['3','не читается','цикл уже завершён']],['Объявить guessed внутри цикла и потерять состояние.','Забыть break и продолжить читать числа после победы.','Проверять guessed до цикла, а не после него.'],
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int secret = 7;
        boolean guessed = false;
        for (int attempt = 1; attempt <= 3; attempt++) {
            int guess = scanner.nextInt();
            if (guess == secret) {
                guessed = true;
                break;
            }
        }
        if (guessed) {
            System.out.println("Победа");
        } else {
            System.out.println("Попытки закончились");
        }
    }
}`));

addTask('t11-vowels',11,'Подсчёт гласных','Прочитай строку и посчитай русские гласные буквы: а, е, ё, и, о, у, ы, э, ю, я. Регистр не учитывай.',
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        int count = 0;
        // Пройди строку и проверь каждый символ
    }
}`,
[{input:'Привет мир\n',expected:'3',label:'Слова с пробелом'},{input:'АУЕЁ\n',expected:'4',label:'Заглавные гласные'},{input:'rhythm\n',expected:'0',label:'Нет русских гласных'}],
['Сначала приведи строку к нижнему регистру и сохрани результат.','Создай строку со всеми десятью русскими гласными.','Для каждого символа проверь, есть ли он в строке гласных: indexOf(ch) >= 0.'],
walk('Мы не ищем отдельную букву, а проверяем каждый символ текста. Чтобы не писать две проверки для «А» и «а», приведём весь текст к нижнему регистру.',['Вызови text.toLowerCase() и сохрани результат обратно в text.','Создай count = 0 до цикла.','Пройди индексы от 0 до text.length() - 1 через условие i < text.length().','Возьми текущий символ через charAt(i).','Если строка vowels содержит символ (indexOf возвращает индекс 0 или больше), увеличь count.','После цикла выведи count.'],[['Символ','Есть в vowels?','count'],['п','нет','0'],['р','нет','0'],['и','да','1'],['в','нет','1'],['е','да','2'],['т','нет','2'],['м','нет','2'],['и','да','3'],['р','нет','3']],['Забыть toLowerCase() и не посчитать заглавные буквы.','Использовать text.length() как последний индекс: это выход за границы.','Создать count внутри цикла и каждый раз обнулять его.'],
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine().toLowerCase();
        String vowels = "аеёиоуыэюя";
        int count = 0;
        for (int i = 0; i < text.length(); i++) {
            char ch = text.charAt(i);
            if (vowels.indexOf(ch) >= 0) count++;
        }
        System.out.println(count);
    }
}`));

addTask('t11-word-count',11,'Подсчёт слов в строке','Прочитай строку и выведи количество слов. Слова разделяются одним или несколькими пробелами. Пустая строка или строка из пробелов содержит 0 слов.',
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        // Посчитай слова, учитывая пустую строку
    }
}`,
[{input:'Java is fun\n',expected:'3',label:'Три слова'},{input:'  Java   is   fun  \n',expected:'3',label:'Несколько пробелов'},{input:'   \n',expected:'0',label:'Только пробелы'},{input:'\n',expected:'0',label:'Пустая строка'}],
['Пробелы по краям мешают, поэтому сначала вызови trim().','Проверь isEmpty(): если строка пустая, ответ сразу 0.','Иначе раздели по одному или нескольким пробельным символам через split("\\\\s+") и возьми длину массива.'],
walk('Разбить текст на слова проще, чем вручную искать каждую границу. Но пустой ввод нужно обработать отдельно: иначе можно ошибочно посчитать пустую часть как слово.',['Удали пробелы по краям с помощью trim().','Если после trim() строка пустая, выведи 0 и заверши программу.','В противном случае вызови split("\\\\s+"): выражение означает один или более пробельных символов.','Получится массив слов. Его длина — количество слов.','Выведи длину массива.'],[['Исходная строка','После trim','Количество'],['" Java is fun "','"Java is fun"','3'],['"Java   is fun"','"Java   is fun"','3'],['"   "','""','0'],['""','""','0']],['Не проверять пустую строку до split.','Использовать split(" "), который плохо обрабатывает много пробелов подряд.','Забыть, что split возвращает массив, а не число.'],
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine().trim();
        if (text.isEmpty()) {
            System.out.println(0);
            return;
        }
        String[] words = text.split("\\\\s+");
        System.out.println(words.length);
    }
}`));

// Three independent no-hint tasks for the lesson 12 control check.
addTask('t12-even-sum',12,'Сумма чётных чисел массива','Введи N, затем N целых чисел. Выведи сумму только чётных элементов массива. N не меньше 1. Подсказок в контрольной нет.',
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int sum = 0;
        // Найди сумму только чётных элементов
    }
}`,
[{input:'5\n1 2 3 4 5\n',expected:'6',label:'Два чётных числа'},{input:'4\n1 3 5 7\n',expected:'0',label:'Нет чётных чисел'},{input:'3\n-2 0 7\n',expected:'-2',label:'Отрицательное и ноль'}],[],
walk('Эта задача объединяет массивы, цикл, условие и накопитель. Для каждого числа нужно решить, подходит ли оно для суммы.',['Считай количество элементов n.','Создай sum = 0 до цикла.','Повтори чтение n раз.','Для каждого числа проверь остаток при делении на 2: если число % 2 == 0, прибавь его к sum.','После цикла выведи сумму.'],[['Число','Чётное?','sum'],['1','нет','0'],['2','да','2'],['3','нет','2'],['4','да','6'],['5','нет','6']],['Объявить sum внутри цикла.','Использовать условие number % 2 == 1: отрицательные чётные числа тоже нужно учитывать правильно.','Не вывести 0, если чётных чисел нет.'],
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int sum = 0;
        for (int i = 0; i < n; i++) {
            int number = scanner.nextInt();
            if (number % 2 == 0) sum += number;
        }
        System.out.println(sum);
    }
}`));

addTask('t12-palindrome',12,'Проверка палиндрома','Прочитай одно слово и определи, одинаково ли оно читается слева направо и справа налево. Сравнение выполняй без учёта регистра. Выведи YES или NO. Подсказок в контрольной нет.',
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine().toLowerCase();
        // Проверь симметричные символы
    }
}`,
[{input:'level\n',expected:'YES',label:'Палиндром'},{input:'Java\n',expected:'NO',label:'Не палиндром'},{input:'A\n',expected:'YES',label:'Один символ'},{input:'Noon\n',expected:'YES',label:'Без учёта регистра'}],[],
walk('У палиндрома симметричные символы совпадают: первый с последним, второй с предпоследним и так далее. Достаточно проверить первую половину строки.',['Приведи строку к нижнему регистру.','Создай boolean palindrome = true.','Сравни text.charAt(i) и text.charAt(text.length() - 1 - i).','Достаточно идти от i = 0, пока i < text.length() / 2.','Если нашли несовпадение, palindrome = false и можно остановить цикл.','Выведи YES при true, иначе NO.'],[['Строка','Сравнения','Ответ'],['level','l == l, e == e','YES'],['java','j != a уже на первом шаге','NO'],['a','нет пар для сравнения','YES']],['Проверять только соседние символы вместо зеркальных пар.','Индекс справа считать как length() - i, забыв вычесть 1.','Для строки длиной 1 ответ должен быть YES.'],
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine().toLowerCase();
        boolean palindrome = true;
        for (int i = 0; i < text.length() / 2; i++) {
            if (text.charAt(i) != text.charAt(text.length() - 1 - i)) {
                palindrome = false;
                break;
            }
        }
        System.out.println(palindrome ? "YES" : "NO");
    }
}`));

addTask('t12-frequency',12,'Частота символа','Введи строку в первой строке и один символ во второй. Выведи, сколько раз этот символ встречается в строке. Сравнение точное, с учётом регистра. Подсказок в контрольной нет.',
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        char target = scanner.nextLine().charAt(0);
        // Посчитай совпадения
    }
}`,
[{input:'banana\na\n',expected:'3',label:'Три совпадения'},{input:'Java\na\n',expected:'2',label:'Регистр учитывается'},{input:'aaaa\nb\n',expected:'0',label:'Нет совпадений'}],[],
walk('Нужно один раз пройти строку и сравнить каждый символ с target. Это похожий на подсчёт цифр в строке алгоритм, только условие другое.',['Считай всю строку через nextLine().','Считай символ target со следующей строки.','Создай count = 0 до цикла.','Пройди строку циклом по индексам.','Если текущий символ равен target, увеличь count.','Выведи count после цикла.'],[['Символы banana','Сравнение с a','count'],['b','не равно','0'],['a','равно','1'],['n','не равно','1'],['a','равно','2'],['n','не равно','2'],['a','равно','3']],['Объявить счётчик внутри цикла.','Сравнивать строки через == вместо char с char.','Забыть, что регистр учитывается: A и a разные символы.'],
`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        char target = scanner.nextLine().charAt(0);
        int count = 0;
        for (int i = 0; i < text.length(); i++) {
            if (text.charAt(i) == target) count++;
        }
        System.out.println(count);
    }
}`));

TASKS.push(...V3_TASKS);

const t4sum = TASKS.find(t=>t.id==='t4-sum');
if(t4sum)t4sum.walkthrough=walk('Нужно сложить числа от 1 до N. Для этого подходит накопитель: сначала сумма равна 0, а потом на каждом шаге к ней добавляется очередное число.', ['Прочитай N.','Создай sum = 0 до цикла.','Запусти for с i = 1, пока i <= n.','Внутри цикла выполни sum += i.','После цикла выведи sum. Если N = 0, цикл не запустится, и останется 0.'], [['i','sum до прибавления','sum после прибавления'],['1','0','1'],['2','1','3'],['3','3','6'],['4','6','10'],['5','10','15']], ['Создать sum внутри цикла и каждый раз обнулять.','Написать i < n и пропустить последнее число N.','Начать i с нуля, хотя сумма должна идти от 1.'], `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += i;
        }
        System.out.println(sum);
    }
}`);
const t4rect = TASKS.find(t=>t.id==='t4-rectangle');
if(t4rect)t4rect.walkthrough=walk('Прямоугольник — это строки одинаковой ширины. Поэтому нужны два счётчика: внешний отвечает за номер строки, внутренний — за символы внутри текущей строки.', ['Прочитай высоту h и ширину w.','Внешний for повторяется h раз: это количество строк.','Внутри него запусти второй for от 0 до w - 1.','Внутренний цикл печатает одну звёздочку без перехода на новую строку.','Когда внутренний цикл закончен, внешний печатает println() и начинает следующую строку.'], [['Внешняя строка','Шаг внутреннего цикла','Вывод строки'],['1','1, 2, 3, 4','****'],['после строки 1','внутренний цикл завершён','переход на новую строку'],['2','1, 2, 3, 4','****'],['3','1, 2, 3, 4','****']], ['Поставить println() внутри внутреннего цикла — каждая звёздочка окажется на новой строке.','Перепутать h и w.','Поставить внутреннему циклу условие col <= w и напечатать лишнюю звёздочку.'], `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int h = scanner.nextInt();
        int w = scanner.nextInt();
        for (int row = 0; row < h; row++) {
            for (int col = 0; col < w; col++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}`);

// Attach reliable walkthroughs to two legacy exercises whose original work is known.
const oldSwap = TASKS.find(t => t.id === 't1-swap');
if (oldSwap) oldSwap.walkthrough = walk('Если сначала выполнить a = b, старое значение a потеряется. Поэтому сначала сохраним его во временную переменную.', ['Сохрани старое a: int temp = a.','Запиши в a значение b.','Запиши в b сохранённое temp.','Выведи обе переменные и проверь, что значения поменялись местами.'], [['Шаг','a','b','temp'],['До обмена','3','8','—'],['Сохранили a','3','8','3'],['a = b','8','8','3'],['b = temp','8','3','3']], ['Не сохранять старое a до присваивания.','После обмена проверить только одну переменную.'], `int temp = a;\na = b;\nb = temp;`);
const oldLeap = TASKS.find(t => t.id === 't2-leap');
if (oldLeap) oldLeap.walkthrough = walk('Обычный високосный год делится на 4. Но годы, кратные 100, не високосные — кроме тех, что делятся на 400. Это правило важно записать со скобками.', ['Проверь особое правило: year % 400 == 0 — такой год високосный.','Иначе, если year % 100 == 0, год не високосный.','В остальных случаях проверь year % 4 == 0.','Сформируй один boolean или цепочку if/else и выведи требуемый форматом задачи результат.'], [['Год','Делится на 400','На 100','На 4','Итог'],['1900','нет','да','да','не високосный'],['2000','да','да','да','високосный'],['2024','нет','нет','да','високосный'],['2023','нет','нет','нет','не високосный']], ['Проверить деление на 4 раньше исключения для 100.','Забыть исключение для 400.','Смешать && и || без скобок.'], `boolean leap = (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);`);

// Historical exercises with missing original statements are deliberately not given invented solutions.
const oldDigits = TASKS.find(t => t.id === 't3-digits');
if (oldDigits) {
  oldDigits.starterCode = `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int n = scanner.nextInt();\n        int count = 0;\n        while (n > 0) {\n            int digit = n % 10;\n            if (digit == 0) count++;\n            n = n / 10;\n        }\n        System.out.println(count);\n    }\n}`;
  oldDigits.tests = [{input:'1000\n',expected:'3',label:'Три нуля'},{input:'10200\n',expected:'3',label:'Нули в середине и конце'},{input:'123\n',expected:'0',label:'Нулей нет'},{input:'505\n',expected:'1',label:'Проверка из прошлого занятия'}];
  oldDigits.walkthrough = walk('По истории прошлого занятия задача была о подсчёте нулей в числе. Известны ключевые приёмы и проверка 505 → 1. Полное исходное условие и точный формат вывода не сохранились, поэтому не будем выдумывать дополнительные требования.', ['Для положительного n получи последнюю цифру: digit = n % 10.','Если digit == 0, увеличь count.','Убери последнюю цифру: n = n / 10.','Повторяй, пока n > 0.','Для 505 цифры справа налево: 5, 0, 5. Ноль встретился один раз.','Отдельно помни: при n = 0 цикл while (n > 0) не запускается. В прошлом уроке это допущение было принято для упражнения.'], [['Шаг','n','digit','count'],['1','505','5','0'],['2','50','0','1'],['3','5','5','1'],['конец','0','—','1']], ['Не портить n до проверки последней цифры.','Забыть уменьшать n — получится бесконечный цикл.','Не перезапустить программу после изменения входных данных.'], `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int n = scanner.nextInt();\n        int count = 0;\n        while (n > 0) {\n            int digit = n % 10;\n            if (digit == 0) count++;\n            n = n / 10;\n        }\n        System.out.println(count);\n    }\n}`);
}

// Expanded explanations for lessons 1–12: analogy, a worked example, and common traps.
const TEACHING_GUIDE = {
1:{plain:'Представь, что переменная — подписанная коробка. Тип данных говорит, что именно можно хранить в этой коробке. Имя помогает понять смысл значения, а присваивание кладёт в неё новое значение.',worked:'Например, int price = 120 и int count = 3. Выражение price * count сначала вычисляет 360, а затем это значение можно сохранить в int total. Если позже выполнить total = total - 20, в коробке total окажется уже 340.',mistakes:['Объявлять переменную, но не присваивать ей значение до чтения.','Путать = (присвоить) и == (сравнить).','Ожидать дробный результат от деления двух int: 5 / 2 даст 2.'],plan:['Назови входные данные и их типы.','Создай переменные с понятными именами.','Вычисли результат отдельным выражением.','Выведи результат и проверь простой пример.']},
2:{plain:'Условие — это развилка. Программа проверяет выражение, которое даёт только true или false, и выбирает путь. В цепочке if / else if / else срабатывает первая подходящая ветка, поэтому порядок проверок важен.',worked:'Для скидки можно проверить: если сумма не меньше 5000 — скидка 10%; иначе, если сумма не меньше 2000 — скидка 5%; иначе скидки нет. Более высокий порог стоит первым, иначе сумма 6000 попадёт в ветку 2000 и до проверки 5000 программа уже не дойдёт.',mistakes:['Проверять общий случай раньше частного.','Писать if (a = b) вместо сравнения a == b.','Соединять условия && и || без скобок, когда приоритет трудно прочитать.'],plan:['Перечисли все возможные исходы.','Для каждого исхода запиши условие словами.','Расположи проверки от более частной к более общей.','Проверь значение на границе каждого условия.']},
3:{plain:'while — это «повторяй, пока условие истинно». До цикла подготовь то, что должно пережить все повторения: накопитель, счётчик и рабочее значение. Внутри цикла обязательно должно что-то менять условие остановки.',worked:'Для 505 начинаем с count = 0. Остаток 505 % 10 равен 5, поэтому счётчик не меняется. Делим 505 на 10 целочисленно — остаётся 50. Следующая последняя цифра равна 0, увеличиваем count до 1. Затем получаем 5 и заканчиваем с ответом 1.',mistakes:['Объявлять накопитель внутри цикла и обнулять его на каждом шаге.','Забывать изменять n и получать бесконечный цикл.','Считать, что n = 0 автоматически обработается циклом while (n > 0).'],plan:['Определи условие продолжения.','До цикла задай счётчик или накопитель.','Внутри цикла обработай один элемент.','Обязательно измени рабочее значение.','Прогони алгоритм по таблице вручную.']},
4:{plain:'for — удобен, когда есть счётчик и понятный диапазон повторений. Его заголовок читается как три команды: начни с этого значения; повторяй, пока условие истинно; после каждого круга измени счётчик.',worked:'for (int i = 1; i <= 3; i++) выводит 1, 2 и 3. После вывода 3 шаг i++ меняет значение на 4. Проверка 4 <= 3 ложна, поэтому четвёртого вывода не будет. Во вложенных циклах внутренний цикл завершается полностью на каждой итерации внешнего.',mistakes:['Начать с 0 и поставить <= n, получив n + 1 повторений.','Поставить i <= length вместо i < length при обходе индексов.','Вложить println внутрь внутреннего цикла, когда перевод строки нужен после всей строки рисунка.'],plan:['Выпиши все значения счётчика.','Отдельно проверь первую и последнюю итерации.','Для двух циклов подпиши, за что отвечает внешний и внутренний.','Сделай маленькую таблицу значений.']},
5:{plain:'String — это целый текст, а char — один символ из него. Строка похожа на ряд пронумерованных ячеек: нумерация начинается с нуля, поэтому последняя ячейка имеет номер length() - 1.',worked:'Для text = "cat" длина равна 3. Символы: text.charAt(0) → c, charAt(1) → a, charAt(2) → t. Поэтому безопасный цикл идёт от 0, пока i < text.length().',mistakes:['Использовать индекс length(), которого уже не существует.','Путать text.length() у String и array.length у массива.','Думать, что toLowerCase() меняет исходную строку автоматически.'],plan:['Посмотри на длину строки.','Пройди индексы от 0 до длины не включая её.','Возьми один char и проверь его.','Обнови счётчик только при выполнении условия.']},
6:{plain:'Массив — это ряд ячеек одного типа. У него фиксированная длина. Каждая ячейка доступна по индексу, а не по порядковому номеру человека: первая ячейка имеет индекс 0.',worked:'Для массива {-5, -2, -9} начни max с numbers[0], то есть -5. Следующее значение -2 больше -5 — обнови max. Значение -9 уже меньше -2, значит итоговый максимум -2. Если начать с нуля, ответ ошибочно станет 0.',mistakes:['Обращаться к numbers[n] для массива длины n.','Начать поиск максимума с 0, когда все элементы могут быть отрицательными.','Перепутать length (массив) и length() (строка).'],plan:['Создай массив нужной длины.','Заполни его ровно N значениями.','Определи первый и последний индексы.','Обойди массив циклом и обновляй результат.']},
7:{plain:'Метод — это именованный небольшой исполнитель. Ты передаёшь ему входные значения через параметры, он выполняет одну задачу и при необходимости возвращает результат через return. Так main не превращается в длинную простыню.',worked:'Вызов maxOfThree(4, 9, 2) передаёт в параметры a, b и c числа 4, 9 и 2. Метод хранит текущий максимум в max и в конце возвращает 9. println лишь показывает возвращённый результат.',mistakes:['Путать параметр в объявлении метода с аргументом при вызове.','Пытаться вернуть значение из метода void.','Ожидать, что локальная переменная main доступна внутри другого метода без передачи.'],plan:['Дай методу имя-действие.','Определи, какие данные ему нужны.','Выбери тип возвращаемого значения.','Верни результат и проверь вызов на нескольких входах.']},
8:{plain:'Scanner — это инструмент чтения входных данных. Он читает следующий токен или строку. switch — это выбор одного варианта из заранее известного набора, например пунктов меню.',worked:'Если пользователь вводит «2 8 3», программа читает choice = 2, a = 8, b = 3. В switch выбирается case 2 и выводится 8 - 3, то есть 5. После break остальные ветки не выполняются.',mistakes:['Вызвать next() вместо nextLine(), когда нужны пробелы.','После nextInt() вызвать nextLine() и получить пустой остаток строки.','Забыть default или перепутать порядок вводимых чисел.'],plan:['Запиши порядок входных данных.','Считай их теми методами Scanner, которые подходят формату.','Используй switch для фиксированных вариантов.','Проверь неизвестное значение и переходы между ветками.']},
9:{plain:'Отладка — это не угадывание, а сбор доказательств. Stack trace подсказывает тип исключения и место ошибки. Отладчик позволяет остановиться на строке и посмотреть значения переменных в конкретный момент.',worked:'Если среднее двух чисел 2 и 3 считается как 2.0, проверь выражение справа от знака =. В int / int дробная часть отбрасывается до того, как результат попадёт в double. Запись (double) sum / n меняет тип вычисления до деления.',mistakes:['Исправлять код, не проверив, какой именно файл/ввод запускается.','Преобразовывать результат после уже выполненного целочисленного деления.','Не повторять тест, который раньше ломался.'],plan:['Прочитай первую полезную строку stack trace.','Найди строку своего кода.','Воспроизведи проблему маленьким входом.','Посмотри значения переменных.','Исправь причину и повтори старый тест плюс границу.']},
10:{plain:'Мини-проект «Угадай число» — это не новая магия, а соединение уже знакомых частей. У игры есть состояние (секретное число, число попыток, факт победы), цикл для повторных ходов и условие для остановки.',worked:'Поставь guessed = false до цикла. После каждой догадки сравни её с секретом. Если совпала — установи guessed = true и выйди через break. После цикла значение guessed подскажет, победил игрок или попытки закончились.',mistakes:['Создавать guessed внутри цикла и каждый раз возвращать false.','Забыть break после победы.','Печатать «попытки закончились», даже если победа произошла на последнем ходу.'],plan:['Подготовь начальное состояние игры.','Определи, сколько раз можно повторять ход.','На каждом ходе прочитай ввод и проверь его.','Определи точное условие победы и выхода.','После цикла выведи итог.']},
11:{plain:'Анализатор текста состоит из маленьких операций над String. Можно пройти текст по символам, а можно сначала разделить его на слова. До алгоритма уточни, что именно считается гласной или словом.',worked:'Для подсчёта гласных приведи текст к нижнему регистру, затем проверь каждый символ на вхождение в строку «аеёиоуыэюя». Для подсчёта слов сначала удали пробелы по краям; если строка стала пустой, выведи 0, иначе раздели её по одному или нескольким пробельным символам.',mistakes:['Не учитывать заглавные буквы.','Разделять строку только по одному пробелу, хотя подряд может быть несколько.','Не обработать пустую строку.'],plan:['Прочитай текст целиком.','Нормализуй регистр или пробелы, если это указано в условии.','Выбери: перебор char или split.','Обработай пустой ввод отдельно.','Проверь строку с пробелами, заглавными и без совпадений.']},
12:{plain:'Контрольная проверяет, умеешь ли ты начать с пустого файла. Подсказок нет намеренно: это измерение самостоятельного навыка. Три задачи проверяют разные способы сочетать массивы, строки, условия и циклы.',worked:'Перед кодом разложи каждую задачу на вход, выход, переменные и повторяющееся действие. Прогони маленький пример на бумаге, а затем напиши программу. Если тест не прошёл — не угадывай, сравни фактический и ожидаемый вывод и пройди переменные по шагам.',mistakes:['Начинать печатать код, не поняв формат ввода/вывода.','Не проверять граничные случаи.','Засчитывать задачу после просмотра разбора: её нужно решить повторно с нуля.'],plan:['Перескажи условие одним предложением.','Выпиши входные и выходные данные.','Прогони крошечный пример вручную.','Опиши шаги алгоритма словами.','Напиши код и проверь границы.']}
};

// Add one short plain-language section into the original detailed theory for each lesson.
function getTaskReviewDueAt(taskId) { return state.reviewQueue?.[taskId]?.dueAt || null; }
function scheduleReview(taskId, reason) {
  state.reviewQueue = state.reviewQueue || {};
  state.reviewQueue[taskId] = { dueAt: Date.now() + 2 * 24 * 60 * 60 * 1000, reason, createdAt: Date.now() };
}
function removeReview(taskId) { if (state.reviewQueue) delete state.reviewQueue[taskId]; }
function dueReviews() { return Object.entries(state.reviewQueue || {}).filter(([,v]) => Number(v.dueAt) <= Date.now()).map(([id,v]) => ({task:TASKS.find(t=>t.id===id),...v})).filter(x=>x.task); }
function dateLabel(value) { return new Date(value).toLocaleDateString('ru-RU',{day:'numeric',month:'long'}); }
function reviewCount() { return Object.keys(state.reviewQueue || {}).length; }
function queueNote(taskId, note) {
  if (!note.trim()) return;
  state.taskNotes = state.taskNotes || {};
  state.taskNotes[taskId] = note.trim();
  scheduleReview(taskId, 'Заметка: вернуться к затруднению и проверить, что оно устранено.');
  const task = TASKS.find(t=>t.id===taskId);
  state.journals = state.journals || [];
  state.journals.push({title: task?.title || taskId, error: note.trim(), rule: 'Вернись к этой заметке при повторном решении задачи.', date: new Date().toLocaleString('ru-RU'), taskId});
}

// New state fields are merged without touching existing v1 progress.
state = {
  ...state,
  taskNotes: state.taskNotes || {},
  reviewQueue: state.reviewQueue || {},
  walkthroughSeen: state.walkthroughSeen || {},
  walkthroughAvailable: state.walkthroughAvailable || {},
  archivedDrafts: state.archivedDrafts || {},
  studySessions: state.studySessions || [],
  studySessionStartedAt: state.studySessionStartedAt || null,
  quizScores: state.quizScores || {}, quizAnswers: state.quizAnswers || {},
  taskStatus: state.taskStatus || {}, drafts: state.drafts || {}, hintCounts: state.hintCounts || {},
  attempts: state.attempts || [], journals: state.journals || [], notes: state.notes || {}, testRuns: state.testRuns || {}
};
persist();

// Existing tasks from the original plan keep their historical names and status.
TASKS.forEach(task => { if (!task.walkthrough) task.walkthrough = walk('В исходной истории сохранилось название этой задачи, но не полное условие и не проверенный вариант решения. Чтобы не выдать догадку за твой прошлый материал, здесь можно записать актуальное условие и свои шаги, а полный разбор добавим после восстановления исходной формулировки.', ['Запиши точное условие своими словами.','Отдельно выпиши, что получает программа и что должна вывести.','Разбери один маленький пример на бумаге.','Составь алгоритм словами до написания Java-кода.'], [], ['Полное первоначальное условие не сохранилось. Не полагайся на выдуманный готовый код; при необходимости пришли старое условие или скриншот.'], null); });

function renderWalkthrough(task) {
  const w = task.walkthrough || {};
  const trace = (w.trace || []).length ? `<div class="walk-trace"><h4>Пошаговый пример</h4><div class="table-scroll"><table><tbody>${w.trace.map((row,i)=>`<tr>${row.map(cell=>i===0?`<th>${escapeHtml(cell)}</th>`:`<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>` : '';
  const solution = w.solution ? `<details class="solution-details"><summary>Показать пример кода</summary><p>Сначала прочитай ход мысли и попробуй восстановить код сам. Этот пример нужен для разбора, а не для автоматического зачёта.</p><pre class="code-sample">${escapeHtml(w.solution)}</pre><button class="btn btn-light" data-copy-solution="${task.id}">Скопировать пример</button></details>` : `<div class="notice"><span class="notice-icon">ⓘ</span><div>Точная формулировка старого упражнения не сохранилась. Я не стал придумывать полный ответ. Пришли исходное условие — добавим точный разбор.</div></div>`;
  return `<section class="walkthrough-panel" id="walkthrough-panel"><div class="walkthrough-label">РАЗБОР · НЕ ЗАСЧИТЫВАЕТСЯ КАК САМОСТОЯТЕЛЬНОЕ РЕШЕНИЕ</div><h3>Разберём задачу по шагам</h3><p class="walkthrough-idea">${escapeHtml(w.idea || 'Начни с входных данных и маленького примера.')}</p><ol class="walkthrough-steps">${(w.steps||[]).map(s=>`<li>${escapeHtml(s)}</li>`).join('')}</ol>${trace}<div class="walk-pitfalls"><h4>Типичные ошибки</h4><ul>${(w.pitfalls||[]).map(p=>`<li>${escapeHtml(p)}</li>`).join('')}</ul></div>${solution}<div class="review-reminder"><strong>Что дальше?</strong><p>Просмотр разбора сохранён. Задача добавлена в повторение через 2 дня. При повторе начни с чистого черновика, не открывая этот разбор.</p></div></section>`;
}
function showWalkthrough(taskId) {
  const task = TASKS.find(t=>t.id===taskId); if (!task) return;
  const editor = document.getElementById('task-draft');
  if (editor) state.drafts[taskId] = editor.value;
  state.archivedDrafts[taskId] = state.drafts[taskId] || '';
  const hintsUsedBeforeWalkthrough = Number(state.hintCounts[taskId]) || 0;
  state.walkthroughSeen[taskId] = {at: Date.now(), title: task.title};
  state.walkthroughAvailable[taskId] = false;
  state.drafts[taskId] = task.starterCode || '';
  state.hintCounts[taskId] = 0;
  state.taskStatus[taskId] = 'repeat';
  scheduleReview(taskId, 'Открыт разбор: нужно решить задачу заново без подсказок.');
  state.attempts.push({taskId,title:task.title,note:'Открыт пошаговый разбор. Черновик предыдущей попытки сохранён отдельно.',result:'Разбор просмотрен · повтор через 2 дня',hints:hintsUsedBeforeWalkthrough,date:new Date().toLocaleString('ru-RU')});
  persist();
  openTask(taskId, {forceFresh:true, showWalkthrough:true});
}

// Rich, readable lesson pages for the whole first block.
openLesson = function(id) {
  const lesson = getLesson(id); if (!lesson) return;
  currentLessonId = id;
  const detail = LESSON_DETAILS[id];
  if (!detail) { return; }
  const done = state.completedLessons.includes(id);
  const guide = TEACHING_GUIDE[id] || {};
  const taskList = TASKS.filter(t=>t.lesson===id);
  const isControl = id === 12;
  const taskGoal = isControl ? 'Две контрольные задачи. Первую попытку выполни без подсказок; после неудачной проверки откроются три уровня помощи. После разбора потребуется повтор с чистого листа.' : 'Сначала попробуй самостоятельно около 25 минут. Затем открывай подсказки по одной. Если всё равно не получается, нажми «Открыть разбор» — сайт сохранит попытку и назначит повтор.';
  const quizHtml = detail.quiz ? `<div class="modal-section"><div class="panel-head"><div><h3>Проверка понимания</h3><p>Ответь без конспекта, а затем проверь себя. После каждого ответа прочитай объяснение.</p></div><span class="tag">${detail.quiz.length} вопроса</span></div><form id="lesson-quiz">${detail.quiz.map((q,i)=>`<div class="quiz-question"><strong>${i+1}. ${escapeHtml(q.q)}</strong>${q.options.map((option,j)=>`<label class="quiz-option"><input type="radio" name="q${i}" value="${j}" ${Number(state.quizAnswers[id]?.[i])===j?'checked':''}> <span>${escapeHtml(option)}</span></label>`).join('')}<div class="quiz-explain" id="quiz-explain-${i}"></div></div>`).join('')}<button class="btn btn-primary" type="submit">Проверить ответы</button><div id="quiz-score" class="quiz-result" aria-live="polite">${state.quizScores[id] !== undefined ? `Последний результат: ${state.quizScores[id]} из ${detail.quiz.length}.` : 'Результат будет сохранён в истории.'}</div></form></div>` : '';
  const lessonTasks = `<div class="modal-section"><div class="panel-head"><div><h3>${isControl?'Контрольная':'Практика'} · ${taskList.length} ${isControl?'задачи':'задачи'}</h3><p>${escapeHtml(taskGoal)}</p></div><span class="tag">${taskList.filter(t=>['done','hint'].includes(state.taskStatus[t.id])).length}/${taskList.length}</span></div><div class="lesson-task-links">${taskList.map((t,i)=>`<button class="btn btn-light" data-open-task="${t.id}">Задача ${i+1} · ${escapeHtml(t.title)} <span class="task-status-inline">${escapeHtml(taskStatusLabel(state.taskStatus[t.id]||'todo')[1])}</span></button>`).join('')}</div></div>`;
  const requiredScore = id === 12 ? 3 : 2;
  const taskDone = taskList.every(t=>['done','hint'].includes(state.taskStatus[t.id]) && !state.reviewQueue[t.id]);
  const scoreOk = detail.quiz ? Number(state.quizScores[id] ?? -1) >= requiredScore : true;
  const canDone = taskDone && scoreOk;
  const completionHtml = `<div class="modal-section"><div class="lesson-complete-state"><div><strong>Условия завершения урока</strong><p>${isControl?'Обе контрольные задачи нужно сдать без подсказок; первая попытка выполняется самостоятельно. Если пришлось открыть помощь или разбор, назначается повтор. Для теоретической проверки нужно 3 из 3.':'Не менее 2 правильных ответов из 3 и обе задачи пройдены тестами. Если открывал разбор или подсказки, сначала пройди повтор без помощи.'}</p></div><span class="tag ${done?'green':''}">${done?'Урок пройден':canDone?'Можно завершить':'В процессе'}</span></div><button class="btn btn-primary" id="mark-lesson-complete" ${canDone?'':'disabled'}>${done?'Урок уже пройден':'Отметить урок пройденным'}</button></div>`;
  const theory = detail.theory.map((part,i)=>`<article class="theory-chunk"><h4>${i+1}. ${escapeHtml(part[0])}</h4><p>${escapeHtml(part[1])}</p></article>`).join('');
  const plainGuide = `<section class="plain-guide"><div class="eyebrow">ОБЪЯСНЕНИЕ БЕЗ СЛОЖНЫХ СЛОВ</div><h3>Сначала пойми идею</h3><p>${escapeHtml(guide.plain || detail.goal)}</p><h4>Разберём на примере</h4><p>${escapeHtml(guide.worked || 'Прочитай пример ниже и пройди значения по шагам.')}</p><h4>План решения незнакомой задачи</h4><ol>${(guide.plan||[]).map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ol><h4>Ошибки, на которые стоит смотреть</h4><ul>${(guide.mistakes||[]).map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul></section>`;
  const body = `<div class="eyebrow">БЛОК ${lesson.block.id} · УРОК ${id} ИЗ ${TOTAL_LESSONS}</div><h2 id="modal-title">${escapeHtml(lesson.title)}</h2><p class="modal-lead">${escapeHtml(detail.goal)}</p><div class="lesson-roadmap"><span>1 · Понять идею</span><span>2 · Теория</span><span>3 · Проверить себя</span><span>4 · Практика</span></div>${plainGuide}<div class="modal-section"><h3>Теория подробно</h3><p class="theory-intro">Не спеши. Читай один раздел, смотри на код и попробуй своими словами объяснить, что произойдёт.</p>${theory}</div><div class="modal-section"><h3>Пример кода</h3><pre class="code-sample">${escapeHtml(detail.code)}</pre><p class="small-muted">Прочитай код сверху вниз. Перед каждой строкой попробуй предсказать, что она изменит.</p></div><div class="modal-section"><h3>Вопросы на понимание</h3>${detail.questions.map((q,i)=>`<details class="question-item"><summary>${i+1}. ${escapeHtml(q[0])}</summary><p>${escapeHtml(q[1])}</p></details>`).join('')}</div>${quizHtml}${lessonTasks}<div class="modal-section"><div class="field"><label for="lesson-note">Мои заметки по уроку</label><textarea id="lesson-note" placeholder="Что понял, что пока непонятно, какой пример стоит повторить…">${escapeHtml(state.notes[id]||'')}</textarea></div><button class="btn btn-light" id="save-lesson-note">Сохранить заметку</button></div>${completionHtml}`;
  openModal(`УРОК ${String(id).padStart(2,'0')}`, body);
  const saveNote = document.getElementById('save-lesson-note');
  saveNote.addEventListener('click',()=>{state.notes[id]=document.getElementById('lesson-note').value;persist();saveNote.textContent='Сохранено ✓';});
  modalContent.querySelectorAll('[data-open-task]').forEach(btn=>btn.addEventListener('click',()=>openTask(btn.dataset.openTask)));
  if (quizHtml) {
    const form = document.getElementById('lesson-quiz');
    form.addEventListener('submit',event=>{
      event.preventDefault(); let score=0; const answers=[];
      detail.quiz.forEach((q,i)=>{const selected=form.querySelector(`input[name="q${i}"]:checked`);const value=selected?Number(selected.value):-1;answers.push(value);const correct=value===q.correct;if(correct)score++;const explain=document.getElementById(`quiz-explain-${i}`);explain.className=`quiz-explain ${correct?'good':'bad'}`;explain.textContent=`${correct?'Верно.':'Пока неверно.'} ${q.why}`;});
      state.quizAnswers[id]=answers;state.quizScores[id]=score;persist();
      const target=document.getElementById('quiz-score');const threshold=id===12?3:2;target.className=`quiz-result ${score>=threshold?'good':'bad'}`;target.textContent=`Результат: ${score} из ${detail.quiz.length}. ${score>=threshold?'Минимальный порог достигнут.':'Вернись к объяснению тех вопросов, где ошибся.'}`;
      const button=document.getElementById('mark-lesson-complete');if(button)button.disabled=!canCompleteLesson(id);
    });
  }
  const complete=document.getElementById('mark-lesson-complete');
  complete.addEventListener('click',()=>{if(!canCompleteLesson(id))return;if(!state.completedLessons.includes(id))state.completedLessons.push(id);state.completedLessons.sort((a,b)=>a-b);persist();closeModal();renderView();});
};

canCompleteLesson = function(id) {
  const taskList=TASKS.filter(t=>t.lesson===id);
  if (!taskList.length) return false;
  const scoreOk = !LESSON_DETAILS[id]?.quiz || Number(state.quizScores[id]??-1) >= (id===12?3:2);
  const tasksOk = taskList.every(t=>['done','hint'].includes(state.taskStatus[t.id]) && !state.reviewQueue[t.id]);
  if (id===12 && taskList.some(t=>Number(state.hintCounts[t.id])>0 || state.walkthroughSeen[t.id])) return false;
  return scoreOk && tasksOk;
};

// Task cards surface notes and upcoming repeats instead of hiding the user's observations.
renderTaskCard = function(task) {
  const status=state.taskStatus[task.id]||'todo'; const [tone,label]=taskStatusLabel(status);
  const latest=state.attempts.filter(a=>a.taskId===task.id).slice(-1)[0];
  const note=state.taskNotes[task.id]; const due=state.reviewQueue[task.id];
  const review=due?`<div class="task-note-strip"><strong>↻ Повторить ${dateLabel(due.dueAt)}</strong><span>${escapeHtml(due.reason||'Вернись к этой задаче.')}</span></div>`:'';
  const noteHtml=note?`<div class="task-note-strip"><strong>Твоя заметка</strong><span>${escapeHtml(note)}</span></div>`:'';
  return `<article class="exercise-card"><div class="exercise-top"><small>УРОК ${task.lesson} · ${escapeHtml(task.difficulty||'Практика')}</small><span class="tag ${tone}">${label}</span></div><h3>${escapeHtml(task.title)}</h3><p>${escapeHtml(task.description)}</p>${review}${noteHtml}<div class="exercise-actions"><button class="btn btn-light" data-task="${task.id}">Открыть упражнение</button>${latest?`<span class="tag">${escapeHtml(latest.result||'Есть попытка')}</span>`:''}</div></article>`;
};

// Dashboard: weekly time budget and visible list of pending tasks.
const oldRenderDashboard = renderDashboard;
renderDashboard = function() {
  let html=oldRenderDashboard();
  const due=dueReviews();
  const allQueue=Object.entries(state.reviewQueue||{}).map(([id,v])=>({task:TASKS.find(t=>t.id===id),...v})).filter(x=>x.task).sort((a,b)=>a.dueAt-b.dueAt);
  const monday=new Date();monday.setHours(0,0,0,0);const day=(monday.getDay()+6)%7;monday.setDate(monday.getDate()-day);
  const minutes=(state.studySessions||[]).filter(s=>s.at>=monday.getTime()).reduce((sum,s)=>sum+s.minutes,0);
  const percent=Math.min(100,Math.round(minutes/420*100));
  const queueHtml=`<section class="panel v3-week-panel"><div class="panel-head"><div><h3>Учебная неделя</h3><p>Ориентир из карты курса — около 7 часов в неделю</p></div><span class="tag">${Math.floor(minutes/60)} ч ${minutes%60} мин / 7 ч</span></div><div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div><div class="session-actions"><button class="btn btn-primary" id="start-study-session">Начать занятие</button><button class="btn btn-light" id="finish-study-session" ${state.studySessionStartedAt?'':'disabled'}>Завершить и сохранить</button><span class="small-muted">${state.studySessionStartedAt?'Идёт занятие':'Время добавляется вручную по кнопке завершения'}</span></div></section><section class="panel v3-review-panel"><div class="panel-head"><div><h3>Задачи, к которым нужно вернуться</h3><p>Заметки, открытые разборы и решения с подсказками не теряются</p></div><span class="tag ${due.length?'amber':'green'}">${due.length} к повтору сейчас</span></div>${allQueue.length?allQueue.map(x=>`<div class="review-row"><div><strong>${escapeHtml(x.task.title)}</strong><small>${escapeHtml(x.reason||'Повторение')} · ${dateLabel(x.dueAt)}</small></div><button class="btn btn-light" data-task="${x.task.id}">${x.dueAt<=Date.now()?'Повторить':'Открыть'}</button></div>`).join(''):'<p class="small-muted">Пока нет задач на повторение. Если откроешь разбор, решишь с подсказкой или сохранишь заметку о затруднении, задача появится здесь.</p>'}</section>`;
  return html.replace('<div class="dashboard-columns">',`${queueHtml}<div class="dashboard-columns">`).replace('Следующая тема по карте курса. Подробный материал будет добавлен перед её прохождением, в привычном формате.','Материалы первого блока подготовлены: подробная теория, вопросы, задачи и разборы.');
};

const oldRenderPractice = renderPractice;
renderPractice = function() {
  let html=oldRenderPractice();
  const upcoming=Object.entries(state.reviewQueue||{}).map(([id,v])=>({task:TASKS.find(t=>t.id===id),...v})).filter(x=>x.task).sort((a,b)=>a.dueAt-b.dueAt);
  const section=`<section class="panel v3-review-panel" style="margin-bottom:14px"><div class="panel-head"><div><h3>Повторение и сохранённые заметки</h3><p>Эти задачи не исчезнут, пока ты не вернёшься к ним и не закрепишь решение</p></div><span class="tag">${upcoming.length}</span></div>${upcoming.length?upcoming.map(x=>`<div class="review-row"><div><strong>${escapeHtml(x.task.title)}</strong><small>${escapeHtml(x.reason||'Повтор')} · ${dateLabel(x.dueAt)}</small></div><button class="btn btn-light" data-task="${x.task.id}">Открыть</button></div>`).join(''):'<p class="small-muted">Очередь повторения пока пуста.</p>'}</section>`;
  return html.replace('<div class="two-col">',`${section}<div class="two-col">`);
};

const oldRenderJournal = renderJournal;
renderJournal = function() {
  let html=oldRenderJournal();
  const notes=Object.entries(state.taskNotes||{}).filter(([,v])=>v.trim());
  const notePanel=`<section class="panel" style="margin-top:14px"><div class="panel-head"><div><h3>Заметки из упражнений</h3><p>Все заметки, сохранённые прямо в карточках задач</p></div><span class="tag">${notes.length}</span></div>${notes.length?notes.map(([id,note])=>{const t=TASKS.find(x=>x.id===id);return `<div class="journal-entry"><strong>${escapeHtml(t?.title||id)}</strong><small>${escapeHtml(state.reviewQueue[id]?`Повтор назначен на ${dateLabel(state.reviewQueue[id].dueAt)}`:'Заметка сохранена')}</small><p>${escapeHtml(note)}</p><button class="btn btn-light" data-task="${id}">Вернуться к задаче</button></div>`}).join(''):'<p class="small-muted">Заметки появятся здесь, когда сохранишь наблюдение в задаче.</p>'}</section>`;
  return html.replace('<section class="panel" style="margin-top:15px">',`${notePanel}<section class="panel" style="margin-top:15px">`);
};

// Preserve autosave, hints, Judge0 tests and task notes in one task flow.
openTask = function(taskId, options = {}) {
  if (typeof options === 'boolean') options = { preserveHintUse: options };
  const task=TASKS.find(t=>t.id===taskId); if(!task)return;
  const due=state.reviewQueue[taskId]; const isDueReview=!!due && due.dueAt<=Date.now();
  const shouldStartDueReview=isDueReview && !due.inProgress;
  if (shouldStartDueReview || options.forceFresh) {
    if (!options.forceFresh) state.archivedDrafts[taskId]=state.drafts[taskId]||'';
    if (shouldStartDueReview) state.reviewQueue[taskId].inProgress=true;
    state.drafts[taskId]=task.starterCode||'';
    state.hintCounts[taskId]=0;
    state.taskStatus[taskId]='repeat';
    state.walkthroughSeen[taskId]=state.walkthroughSeen[taskId]||null;
    persist();
  }
  currentTaskId=taskId;
  const hints=task.hints||[];
  const shown=Math.min(hints.length,Number(state.hintCounts[taskId])||0);
  currentTaskHintUsed=shown>0;
  const status=state.taskStatus[taskId]||'todo';
  const tests=Array.isArray(task.tests)?task.tests:[];
  const hasTests=tests.length>0;
  const previous=state.testRuns[taskId];
  const hintHtml=hints.length?hints.map((h,i)=>i<shown?`<div class="hint-card"><b>Подсказка ${i+1}.</b> ${escapeHtml(h)}</div>`:`<div class="hint-card locked">Подсказка ${i+1} скрыта.</div>`).join(''):'<div class="hint-card">В контрольной нет подсказок. Если тест не пройдёт, появится подробный разбор.</div>';
  const dueLabel=due?`<div class="notice"><span class="notice-icon">↻</span><div><strong>${isDueReview?'Контрольное повторение':'Задача в очереди повторения'}</strong><p>${isDueReview?'Начни с чистого черновика и не открывай старый разбор, пока не попробуешь сам.':`Повтор запланирован на ${dateLabel(due.dueAt)}.`}</p></div></div>`:'';
  const previousNote=state.taskNotes[taskId]||'';
  let savedNote=previousNote;
  const runTestsHtml=hasTests?`<div class="modal-section"><div class="panel-head"><div><h3>Автоматическая проверка</h3><p>Проверяются обычные и граничные случаи. Один запуск не засчитывает задачу.</p></div><span class="tag">${tests.length} тестов</span></div><div class="test-case-list"><strong>Что проверяется</strong>${tests.map((t,i)=>`<div class="test-case"><span>${i+1}. ${escapeHtml(t.label||'Тест')}</span><code>Ввод: ${escapeHtml(t.input.trim()||'пусто')} · Ожидается: ${escapeHtml(t.expected.replace(/\n/g,' ↵ ').trim()||'пустой вывод')}</code></div>`).join('')}</div><button class="btn btn-primary" id="run-task-tests">Проверить все тесты</button><div id="task-test-result" class="run-results">${previous?renderTestRun(previous):'Пока нет результатов проверки.'}</div><div id="walkthrough-nudge"></div></div>`:'';
  const allowWalkthrough=!hints.length || shown>=hints.length;
  const body=`<div class="eyebrow">${escapeHtml(task.difficulty||'ПРАКТИКА')} · УРОК ${task.lesson}</div><h2 id="modal-title">${escapeHtml(task.title)}</h2><p class="modal-lead">${escapeHtml(task.description)}</p>${task.special?`<div class="notice"><span class="notice-icon">ⓘ</span><div>${escapeHtml(task.special)}</div></div>`:''}${dueLabel}
    <div class="modal-section"><div class="panel-head"><div><h3>Попробуй самостоятельно</h3><p>25 минут на попытку — сначала опиши план, потом код. Черновик сохраняется автоматически.</p></div><span class="tag">Java</span></div><div class="field"><label for="task-draft">Твой код</label><div class="java-editor-frame"><div class="editor-line-numbers" id="task-line-numbers" aria-hidden="true">1</div><textarea id="task-draft" class="java-editor" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" placeholder="Начни писать решение на Java…">${escapeHtml(state.drafts[taskId]||task.starterCode||'')}</textarea></div></div><div class="editor-toolbar"><span>Tab — отступ · Ctrl + Enter — запуск</span><button class="btn btn-quiet" id="save-task-draft">Сохранить черновик</button></div><div class="field"><label for="task-stdin">Вход для одного запуска</label><textarea id="task-stdin" class="stdin-editor">${escapeHtml(tests[0]?.input||'')}</textarea></div><div class="exercise-actions"><button class="btn btn-light" id="run-task-once">Запустить код</button><span class="small-muted">Запуск показывает вывод, но не ставит отметку.</span></div><div id="task-run-output" class="console-output">Вывод появится здесь.</div></div>
    ${runTestsHtml}
    <div class="modal-section"><div class="panel-head"><div><h3>Подсказки</h3><p>${hints.length?'Открывай по одной. Полный разбор появится после последней подсказки и неудачной проверки.':'Подсказок нет: это контрольная задача.'}</p></div><span class="tag">${shown}/${hints.length}</span></div><div class="hint-stack">${hintHtml}</div><button class="btn btn-light" id="reveal-hint" ${shown>=hints.length?'disabled':''}>Открыть следующую подсказку</button>${allowWalkthrough?`<div class="walkthrough-choice"><p class="small-muted">${hasTests?'Если после всех подсказок задача всё ещё не получается, разбор откроется автоматически после неудачной проверки. Можно открыть его и вручную.':'Если застрял, открой разбор после собственной попытки.'}</p><button class="btn btn-light" id="show-walkthrough-manual">Я застрял — открыть разбор</button></div>`:''}</div>
    <div class="modal-section"><div class="field"><label for="task-note">Заметка: что получилось / где застрял</label><textarea id="task-note" placeholder="Например: путаюсь в условии цикла, не понимаю, почему индекс выходит за границы…">${escapeHtml(previousNote)}</textarea><small class="small-muted">Заметка сохраняется автоматически, попадёт в журнал и добавит задачу в очередь повторения.</small></div><button class="btn btn-light" id="save-task-note">Сохранить заметку и назначить повтор</button></div>
    <div id="walkthrough-slot">${options.showWalkthrough?renderWalkthrough(task):''}</div>
    <div class="modal-section"><div class="exercise-actions"><span class="tag ${taskStatusLabel(status)[0]}">${taskStatusLabel(status)[1]}</span><span class="small-muted">${due?'Повтор назначен':''}</span></div>${hasTests?'':`<div class="field"><label for="task-result">Самооценка (для старых задач без сохранённого автотеста)</label><select id="task-result"><option value="todo" ${status==='todo'?'selected':''}>Не начато</option><option value="done" ${status==='done'?'selected':''}>Самостоятельно</option><option value="hint" ${status==='hint'?'selected':''}>С подсказкой</option><option value="repeat" ${status==='repeat'?'selected':''}>Повторить</option></select></div>`}<button class="btn btn-primary" id="save-task-attempt">Сохранить попытку</button></div>
    <p class="footer-note">Результат и заметка сохраняются локально на этом устройстве. Если внешний Judge0 недоступен, запусти код в IntelliJ и внеси сюда результат вручную.</p>`;
  openModal(`ПРАКТИКА · УРОК ${task.lesson}`,body);
  const editor=document.getElementById('task-draft');
  const gutter=document.getElementById('task-line-numbers');
  const updateLineNumbers=()=>{if(gutter){const n=editor.value.split('\n').length;gutter.innerHTML=Array.from({length:n},(_,i)=>`<span>${i+1}</span>`).join('');}};
  const saveDraft=()=>{state.drafts[taskId]=editor.value;persist();};
  editor.addEventListener('input',()=>{saveDraft();updateLineNumbers();});
  editor.addEventListener('scroll',()=>{if(gutter)gutter.scrollTop=editor.scrollTop;});
  updateLineNumbers();
  document.getElementById('save-task-draft').addEventListener('click',()=>{saveDraft();document.getElementById('save-task-draft').textContent='Сохранено ✓';});
  const note=document.getElementById('task-note');
  const saveNote=()=>{const value=note.value.trim();if(value!==savedNote){if(value){queueNote(taskId,value);}else{delete state.taskNotes[taskId];}savedNote=value;persist();}};
  note.addEventListener('input',()=>{if(note.value.trim()){state.taskNotes[taskId]=note.value;scheduleReview(taskId,'Заметка требует внимания — вернись к ней при следующей попытке.');}else delete state.taskNotes[taskId];persist();});
  note.addEventListener('change',saveNote);
  document.getElementById('save-task-note').addEventListener('click',()=>{saveNote();const b=document.getElementById('save-task-note');b.textContent='Заметка сохранена ✓';});
  document.getElementById('reveal-hint').addEventListener('click',()=>{state.hintCounts[taskId]=Math.min(hints.length,(Number(state.hintCounts[taskId])||0)+1);currentTaskHintUsed=true;persist();openTask(taskId,{preserveHintUse:true});});
  const manualWalkthrough=document.getElementById('show-walkthrough-manual');
  if(manualWalkthrough)manualWalkthrough.addEventListener('click',()=>{if(confirm('Открыть разбор? Текущий черновик сохранится отдельно, а задача будет назначена на повтор через 2 дня. Разбор не засчитывается как самостоятельное решение.'))showWalkthrough(taskId);});
  const revealWalkthroughIfReady=()=>{
    const canReveal=(!hints.length||Number(state.hintCounts[taskId])>=hints.length);
    const failureRecorded=!!state.walkthroughAvailable[taskId] || (!hasTests && status==='repeat' && shown>=hints.length);
    if(!canReveal || !failureRecorded)return;
    // The learner has exhausted hints and the tests still fail: show the worked solution now.
    // showWalkthrough archives the current draft, resets the editor and schedules a clean retry.
    showWalkthrough(taskId);
  };
  const runOnce=async()=>{const output=document.getElementById('task-run-output');const source=editor.value.trim();if(!source){output.textContent='Сначала напиши код.';return;}const button=document.getElementById('run-task-once');button.disabled=true;output.textContent='Компиляция и запуск…';try{const result=await executeJava(source,document.getElementById('task-stdin').value);output.innerHTML=renderExecution(result);}catch(e){output.textContent=`Не удалось выполнить код: ${e.message}`;}finally{button.disabled=false;saveDraft();}};
  const runTests=async()=>{const output=document.getElementById('task-test-result');const button=document.getElementById('run-task-tests');const source=editor.value.trim();if(!source){output.textContent='Сначала напиши код.';return;}button.disabled=true;button.textContent='Проверяем…';output.textContent='Проверяем тестовые случаи…';saveDraft();const results=[];try{for(let i=0;i<tests.length;i++){const t=tests[i];const ex=await executeJava(source,t.input);const passed=ex.statusId===3&&normalizeOutput(ex.stdout)===normalizeOutput(t.expected);results.push({label:t.label||`Тест ${i+1}`,passed,expected:t.expected,actual:ex.stdout||'',status:ex.status,compileOutput:ex.compileOutput,stderr:ex.stderr});if(ex.statusId!==3)break;}const allPassed=results.length===tests.length&&results.every(x=>x.passed);const hintsUsed=Number(state.hintCounts[taskId])||0;state.taskStatus[taskId]=allPassed?(hintsUsed?'hint':'done'):'repeat';const rec={date:new Date().toLocaleString('ru-RU'),passed:results.filter(x=>x.passed).length,total:tests.length,allPassed,results};state.testRuns[taskId]=rec;state.attempts.push({taskId,title:task.title,note:allPassed?'Все тесты пройдены.':'Автоматические тесты выявили ошибку.',result:allPassed?(hintsUsed?'Решено с подсказкой':'Решено самостоятельно'):'Нужно повторить',hints:hintsUsed,date:rec.date});if(allPassed){state.walkthroughAvailable[taskId]=false;if(hintsUsed)scheduleReview(taskId,'Решение получилось с подсказками — проверь его ещё раз без них.');else if(isDueReview){removeReview(taskId);delete state.walkthroughSeen[taskId];}}else{scheduleReview(taskId,'Тесты не пройдены — вернись к алгоритму и проверь границы.');}persist();output.innerHTML=renderTestRun(rec);if(!allPassed){const canReveal=!hints.length||hintsUsed>=hints.length;if(canReveal){state.walkthroughAvailable[taskId]=true;persist();revealWalkthroughIfReady();}}if(allPassed&&hintsUsed){const n=document.getElementById('walkthrough-nudge');if(n)n.innerHTML='<div class="notice"><span class="notice-icon">↻</span><div><strong>Получилось с подсказками.</strong><p>Задача не потеряется: она назначена на повтор через 2 дня. Реши её снова с чистого листа.</p></div></div>';}if(allPassed&&!hintsUsed&&isDueReview){const n=document.getElementById('walkthrough-nudge');if(n)n.innerHTML='<div class="notice"><span class="notice-icon">✓</span><div><strong>Повтор закреплён.</strong><p>Ты решил задачу без подсказок. Она убрана из очереди повторения.</p></div></div>';}}catch(e){output.textContent=`Ошибка проверки: ${e.message}`;}finally{button.disabled=false;button.textContent='Проверить все тесты';}};
  document.getElementById('run-task-once').addEventListener('click',runOnce);
  if(hasTests)document.getElementById('run-task-tests').addEventListener('click',runTests);
  editor.addEventListener('keydown',event=>{if(event.key==='Tab'){event.preventDefault();const a=editor.selectionStart,b=editor.selectionEnd;editor.value=editor.value.slice(0,a)+'    '+editor.value.slice(b);editor.selectionStart=editor.selectionEnd=a+4;saveDraft();}if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){event.preventDefault();runOnce();}});
  if(state.walkthroughAvailable[taskId] || (hints.length && shown>=hints.length && !hasTests && status==='repeat'))revealWalkthroughIfReady();
  const saveAttempt=document.getElementById('save-task-attempt');
  saveAttempt.addEventListener('click',()=>{saveDraft();saveNote();if(!hasTests){const result=document.getElementById('task-result').value;state.taskStatus[taskId]=result;if(result==='repeat'){scheduleReview(taskId,'Отмечено как задача для повторения.');state.walkthroughAvailable[taskId]=true;}}state.attempts.push({taskId,title:task.title,note:note.value.trim()||'Без заметки',result:taskStatusLabel(state.taskStatus[taskId]||'todo')[1],hints:Number(state.hintCounts[taskId])||0,date:new Date().toLocaleString('ru-RU')});persist();closeModal();renderView();});
  const copyButtons=modalContent.querySelectorAll('[data-copy-solution]');copyButtons.forEach(btn=>btn.addEventListener('click',()=>{const t=TASKS.find(x=>x.id===btn.dataset.copySolution);if(t?.walkthrough?.solution){navigator.clipboard?.writeText(t.walkthrough.solution).then(()=>{btn.textContent='Скопировано ✓';}).catch(()=>{btn.textContent='Скопируй текст из блока кода';});}}));
};

// Correct import handling for added fields and preserve older exports.
const oldExportData = exportData;
exportData = function() {
  const payload={app:'Java Lab',version:'3.1',exportedAt:new Date().toISOString(),state};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`java-lab-backup-${new Date().toISOString().slice(0,10)}.json`;link.click();URL.revokeObjectURL(url);
};

// Weekly study time and review actions.
const oldBindPageEvents = bindPageEvents;
bindPageEvents = function() {
  oldBindPageEvents();
  const start=document.getElementById('start-study-session');
  if(start)start.addEventListener('click',()=>{if(state.studySessionStartedAt){alert('Занятие уже запущено.');return;}state.studySessionStartedAt=Date.now();persist();renderView();});
  const finish=document.getElementById('finish-study-session');
  if(finish)finish.addEventListener('click',()=>{if(!state.studySessionStartedAt)return;const minutes=Math.max(1,Math.min(240,Math.round((Date.now()-state.studySessionStartedAt)/60000)));state.studySessions.push({at:Date.now(),minutes});state.studySessionStartedAt=null;persist();renderView();});
};

// Import migration: state from v2 is accepted and receives empty v3 collections.
const importInput = document.getElementById('import-file');
if(importInput) importInput.addEventListener('change',()=>{});

// The learner confirmed lesson 4 as completed. Upgrade any already-open v3 local save.
state.completedLessons = Array.from(new Set([...(state.completedLessons || []), 4].map(Number))).sort((a,b)=>a-b);
// Mark the initial 505 exercise accurately: the output still awaits a confirmed rerun.
if (state.taskStatus['t3-digits']==='done' && !state.testRuns['t3-digits']) state.taskStatus['t3-digits']='repeat';
persist();

// Re-render with the v3 renderers after preserving the existing v2 localStorage data.
updateSidebarProgress();
renderView();
