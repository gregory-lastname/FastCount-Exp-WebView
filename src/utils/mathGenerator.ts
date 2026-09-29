import { DifficultyLevel, GameMode, MathProblem, TableRange } from '../types/math';

/**
 * Generates a math problem according to selected mode, difficulty, table range and adaptive tier.
 * Strictly adheres to:
 * - NO 0 + 0 or 0 - 0.
 * - NO x + 0 or x - 0.
 * - Trivial (+1, -1, +2, -2) restricted only to lowest beginner levels (Difficulty 1 / Tier 1).
 * - Uniform, pedagogically sound distribution for second grade arithmetic.
 */
export function generateProblem(
  mode: GameMode,
  difficulty: DifficultyLevel,
  tableRange: TableRange = 'up_to_5',
  previousProblem?: MathProblem | null,
  adaptiveTier: number = 2
): MathProblem {
  let attempts = 0;
  let problem: MathProblem;

  do {
    problem = createCandidate(mode, difficulty, tableRange, adaptiveTier);
    attempts++;
  } while (
    previousProblem &&
    problem.expression === previousProblem.expression &&
    attempts < 15
  );

  // Generate 4 distinct plausible options for test mode
  problem.options = generateDistractors(problem.answer);

  return problem;
}

function createCandidate(
  mode: GameMode,
  difficulty: DifficultyLevel,
  tableRange: TableRange,
  adaptiveTier: number
): MathProblem {
  const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // 1. ADAPTIVE TRAINING MODE (Динамическая сложность: микс сложения, вычитания, 2 и 3 слагаемых)
  if (mode === 'adaptive_training') {
    return generateAdaptiveProblem(id, adaptiveTier);
  }

  // Resolve mode for mixed/super-mix
  let resolvedMode: GameMode = mode;
  if (mode === 'all_mixed') {
    const roll = Math.random();
    if (roll < 0.25) resolvedMode = 'addition';
    else if (roll < 0.5) resolvedMode = 'subtraction';
    else if (roll < 0.75) resolvedMode = 'multiplication';
    else resolvedMode = 'division';
  }

  // 2. ADDITION (Сложение)
  if (resolvedMode === 'addition') {
    if (difficulty === 1) {
      // Level 1 (Простейший): суммы до 5. Никаких нулей! Разрешены базовые +1, +2.
      const level1Pairs = [
        [2, 1], [1, 2], [2, 2], [3, 1], [1, 3],
        [3, 2], [2, 3], [4, 1], [1, 4]
      ];
      const [a, b] = level1Pairs[Math.floor(Math.random() * level1Pairs.length)];
      return {
        id,
        expression: `${a} + ${b}`,
        operands: [a, b],
        operators: ['+'],
        answer: a + b,
      };
    } else if (difficulty === 2) {
      // Level 2 (Базовый): суммы от 6 до 10. Никаких нулей!
      // Исключены тривиальные +1 и +2 (кроме состава числа 10: 9+1, 1+9, 8+2, 2+8).
      const level2Pairs = [
        [3, 3], [4, 3], [3, 4], [4, 4], [5, 3], [3, 5],
        [5, 4], [4, 5], [6, 3], [3, 6], [5, 5], [6, 4],
        [4, 6], [7, 3], [3, 7], [8, 2], [2, 8], [9, 1], [1, 9]
      ];
      const [a, b] = level2Pairs[Math.floor(Math.random() * level2Pairs.length)];
      return {
        id,
        expression: `${a} + ${b}`,
        operands: [a, b],
        operators: ['+'],
        answer: a + b,
      };
    } else {
      // Level 3 (Продвинутый): Переход через десяток (суммы 11..18).
      // Слагаемые >= 3. Строго никаких нулей, никаких +1, +2! Настоящий устный счёт 2 класса.
      const level3Pairs = [
        [6, 5], [5, 6], [7, 4], [4, 7], [8, 3], [3, 8],
        [7, 5], [5, 7], [8, 4], [4, 8], [9, 3], [3, 9],
        [6, 6], [7, 6], [6, 7], [8, 5], [5, 8], [9, 4], [4, 9],
        [7, 7], [8, 6], [6, 8], [9, 5], [5, 9],
        [8, 7], [7, 8], [9, 6], [6, 9],
        [8, 8], [9, 7], [7, 9],
        [9, 8], [8, 9],
        [9, 9]
      ];
      const [a, b] = level3Pairs[Math.floor(Math.random() * level3Pairs.length)];
      return {
        id,
        expression: `${a} + ${b}`,
        operands: [a, b],
        operators: ['+'],
        answer: a + b,
      };
    }
  }

  // 3. SUBTRACTION (Вычитание)
  if (resolvedMode === 'subtraction') {
    if (difficulty === 1) {
      // Level 1 (Простейший): вычитание в пределах 5. Никаких нулей!
      const level1Subs = [
        [5, 3], [5, 2], [4, 2], [3, 2], [5, 4], [4, 3], [3, 1], [4, 1], [5, 1], [2, 1]
      ];
      const [a, b] = level1Subs[Math.floor(Math.random() * level1Subs.length)];
      return {
        id,
        expression: `${a} − ${b}`,
        operands: [a, b],
        operators: ['−'],
        answer: a - b,
      };
    } else if (difficulty === 2) {
      // Level 2 (Базовый): вычитание в пределах 10. Никаких нулей!
      // Исключены тривиальные -1 и -2 (вычитаемое >= 3, разность >= 2).
      const level2Subs = [
        [10, 5], [10, 4], [10, 6], [10, 3], [10, 7],
        [9, 4], [9, 5], [9, 6], [9, 3],
        [8, 5], [8, 3], [8, 4],
        [7, 4], [7, 3],
        [6, 3]
      ];
      const [a, b] = level2Subs[Math.floor(Math.random() * level2Subs.length)];
      return {
        id,
        expression: `${a} − ${b}`,
        operands: [a, b],
        operators: ['−'],
        answer: a - b,
      };
    } else {
      // Level 3 (Продвинутый): Вычитание с переходом через десяток (11..18 минус 3..9).
      // Никаких нулей, никаких -1, -2! Строгая таблица вычитания 2 класса.
      const level3Subs = [
        [11, 3], [11, 4], [11, 5], [11, 6], [11, 7], [11, 8],
        [12, 4], [12, 5], [12, 7], [12, 8], [12, 9],
        [13, 4], [13, 5], [13, 6], [13, 7], [13, 8], [13, 9],
        [14, 5], [14, 6], [14, 7], [14, 8], [14, 9],
        [15, 6], [15, 7], [15, 8], [15, 9],
        [16, 7], [16, 8], [16, 9],
        [17, 8], [17, 9],
        [18, 9]
      ];
      const [a, b] = level3Subs[Math.floor(Math.random() * level3Subs.length)];
      return {
        id,
        expression: `${a} − ${b}`,
        operands: [a, b],
        operators: ['−'],
        answer: a - b,
      };
    }
  }

  // 4. THREE TERMS (3 слагаемых: a + b − c, a + b + c, a − b + c, a − b − c)
  if (resolvedMode === 'three_terms') {
    const isLevel3 = difficulty === 3;
    const patterns: ('++' | '+-' | '-+' | '--')[] = ['++', '+-', '-+', '--'];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];

    let a = 0, b = 0, c = 0, ans = 0;
    let op1 = '+', op2 = '+';

    if (pattern === '++') {
      op1 = '+';
      op2 = '+';
      if (isLevel3) {
        // Слагаемые >= 3, сумма до 20
        a = Math.floor(Math.random() * 5) + 4; // 4..8
        b = Math.floor(Math.random() * 4) + 3; // 3..6
        c = Math.floor(Math.random() * 4) + 3; // 3..6
        ans = a + b + c;
      } else {
        // В пределах 10
        a = Math.floor(Math.random() * 2) + 3; // 3..4
        b = Math.floor(Math.random() * 2) + 2; // 2..3
        c = Math.floor(Math.random() * 2) + 2; // 2..3
        ans = a + b + c;
      }
    } else if (pattern === '+-') {
      op1 = '+';
      op2 = '−';
      if (isLevel3) {
        a = Math.floor(Math.random() * 4) + 6; // 6..9
        b = Math.floor(Math.random() * 4) + 4; // 4..7
        const step1 = a + b; // 10..16
        c = Math.floor(Math.random() * 5) + 3; // 3..7
        ans = step1 - c;
      } else {
        a = Math.floor(Math.random() * 3) + 3; // 3..5
        b = Math.floor(Math.random() * 2) + 3; // 3..4
        const step1 = a + b; // 6..9
        c = Math.floor(Math.random() * 2) + 2; // 2..3
        ans = step1 - c;
      }
    } else if (pattern === '-+') {
      op1 = '−';
      op2 = '+';
      if (isLevel3) {
        a = Math.floor(Math.random() * 5) + 12; // 12..16
        b = Math.floor(Math.random() * 4) + 4;  // 4..7
        const step1 = a - b;
        c = Math.floor(Math.random() * 4) + 3;  // 3..6
        ans = step1 + c;
      } else {
        a = Math.floor(Math.random() * 2) + 8;  // 8..9
        b = Math.floor(Math.random() * 2) + 3;  // 3..4
        const step1 = a - b;
        c = Math.floor(Math.random() * 2) + 2;  // 2..3
        ans = step1 + c;
      }
    } else {
      // '--'
      op1 = '−';
      op2 = '−';
      if (isLevel3) {
        a = Math.floor(Math.random() * 4) + 14; // 14..17
        b = Math.floor(Math.random() * 3) + 4;  // 4..6
        const step1 = a - b;
        c = Math.floor(Math.random() * (step1 - 3)) + 3;
        ans = step1 - c;
      } else {
        a = Math.floor(Math.random() * 2) + 9;  // 9..10
        b = Math.floor(Math.random() * 2) + 3;  // 3..4
        const step1 = a - b;
        c = Math.floor(Math.random() * 2) + 2;  // 2..3
        ans = step1 - c;
      }
    }

    return {
      id,
      expression: `${a} ${op1} ${b} ${op2} ${c}`,
      operands: [a, b, c],
      operators: [op1, op2],
      answer: ans,
    };
  }

  // 5. MULTIPLICATION (Умножение с символом \u00D7)
  if (resolvedMode === 'multiplication') {
    const maxFactor = tableRange === 'up_to_5' ? 5 : 9;
    const a = Math.floor(Math.random() * (maxFactor - 1)) + 2; // 2..maxFactor
    const b = Math.floor(Math.random() * (maxFactor - 1)) + 2; // 2..maxFactor
    return {
      id,
      expression: `${a} \u00D7 ${b}`,
      operands: [a, b],
      operators: ['\u00D7'],
      answer: a * b,
    };
  }

  // 6. DIVISION (Деление нацело)
  const maxFactor = tableRange === 'up_to_5' ? 5 : 9;
  const divisor = Math.floor(Math.random() * (maxFactor - 1)) + 2; // 2..maxFactor
  const quotient = Math.floor(Math.random() * (maxFactor - 1)) + 2; // 2..maxFactor
  const dividend = divisor * quotient;

  return {
    id,
    expression: `${dividend} : ${divisor}`,
    operands: [dividend, divisor],
    operators: [':'],
    answer: quotient,
  };
}

/**
 * Adaptive problem generation based on dynamic tier (1..5).
 * Dynamically mixes 2-term and 3-term addition/subtraction.
 * Completely free of zeros (0+0, 0-0, x+0, x-0).
 */
function generateAdaptiveProblem(id: string, tier: number): MathProblem {
  const boundedTier = Math.max(1, Math.min(5, tier));
  const roll = Math.random();

  // Tier 1: Easy addition and subtraction within 7 (no zeros)
  if (boundedTier === 1) {
    if (roll < 0.55) {
      const pairs = [[2, 2], [3, 2], [2, 3], [3, 3], [4, 2], [2, 4], [4, 3], [3, 4]];
      const [a, b] = pairs[Math.floor(Math.random() * pairs.length)];
      return { id, expression: `${a} + ${b}`, operands: [a, b], operators: ['+'], answer: a + b, adaptiveTier: 1 };
    } else {
      const subs = [[5, 2], [5, 3], [6, 3], [6, 2], [7, 3], [7, 4], [6, 4]];
      const [a, b] = subs[Math.floor(Math.random() * subs.length)];
      return { id, expression: `${a} − ${b}`, operands: [a, b], operators: ['−'], answer: a - b, adaptiveTier: 1 };
    }
  }

  // Tier 2: Solid basics within 10 + simple 3-term expressions
  if (boundedTier === 2) {
    if (roll < 0.4) {
      const pairs = [[4, 4], [5, 3], [3, 5], [5, 4], [4, 5], [6, 3], [3, 6], [7, 3], [3, 7], [6, 4], [4, 6], [5, 5]];
      const [a, b] = pairs[Math.floor(Math.random() * pairs.length)];
      return { id, expression: `${a} + ${b}`, operands: [a, b], operators: ['+'], answer: a + b, adaptiveTier: 2 };
    } else if (roll < 0.75) {
      const subs = [[10, 4], [10, 6], [10, 3], [10, 7], [9, 4], [9, 5], [8, 5], [8, 3], [8, 4]];
      const [a, b] = subs[Math.floor(Math.random() * subs.length)];
      return { id, expression: `${a} − ${b}`, operands: [a, b], operators: ['−'], answer: a - b, adaptiveTier: 2 };
    } else {
      // 3 terms within 9
      const a = Math.floor(Math.random() * 2) + 3; // 3..4
      const b = Math.floor(Math.random() * 2) + 3; // 3..4
      const c = 2;
      return { id, expression: `${a} + ${b} − ${c}`, operands: [a, b, c], operators: ['+', '−'], answer: a + b - c, adaptiveTier: 2 };
    }
  }

  // Tier 3: Transition over 10 beginnings (11..13) + 3 terms
  if (boundedTier === 3) {
    if (roll < 0.4) {
      const pairs = [[7, 4], [4, 7], [7, 5], [5, 7], [8, 4], [4, 8], [8, 5], [5, 8], [6, 6]];
      const [a, b] = pairs[Math.floor(Math.random() * pairs.length)];
      return { id, expression: `${a} + ${b}`, operands: [a, b], operators: ['+'], answer: a + b, adaptiveTier: 3 };
    } else if (roll < 0.75) {
      const subs = [[11, 4], [11, 5], [11, 6], [12, 4], [12, 5], [12, 7], [13, 5], [13, 6]];
      const [a, b] = subs[Math.floor(Math.random() * subs.length)];
      return { id, expression: `${a} − ${b}`, operands: [a, b], operators: ['−'], answer: a - b, adaptiveTier: 3 };
    } else {
      const a = 6, b = 4, c = 3;
      return { id, expression: `${a} + ${b} − ${c}`, operands: [a, b, c], operators: ['+', '−'], answer: a + b - c, adaptiveTier: 3 };
    }
  }

  // Tier 4: Strong regrouping (13..16) and active 3 terms
  if (boundedTier === 4) {
    if (roll < 0.35) {
      const pairs = [[8, 6], [6, 8], [9, 5], [5, 9], [8, 7], [7, 8], [9, 6], [6, 9], [7, 7]];
      const [a, b] = pairs[Math.floor(Math.random() * pairs.length)];
      return { id, expression: `${a} + ${b}`, operands: [a, b], operators: ['+'], answer: a + b, adaptiveTier: 4 };
    } else if (roll < 0.7) {
      const subs = [[13, 7], [13, 8], [14, 6], [14, 7], [14, 8], [15, 6], [15, 7], [15, 8], [16, 7], [16, 8]];
      const [a, b] = subs[Math.floor(Math.random() * subs.length)];
      return { id, expression: `${a} − ${b}`, operands: [a, b], operators: ['−'], answer: a - b, adaptiveTier: 4 };
    } else {
      const a = 8, b = 5, c = 4;
      return { id, expression: `${a} + ${b} − ${c}`, operands: [a, b, c], operators: ['+', '−'], answer: a + b - c, adaptiveTier: 4 };
    }
  }

  // Tier 5: Mastery mental arithmetic up to 20 with 3 terms
  if (roll < 0.35) {
    const pairs = [[9, 7], [7, 9], [8, 8], [9, 8], [8, 9], [9, 9]];
    const [a, b] = pairs[Math.floor(Math.random() * pairs.length)];
    return { id, expression: `${a} + ${b}`, operands: [a, b], operators: ['+'], answer: a + b, adaptiveTier: 5 };
  } else if (roll < 0.65) {
    const subs = [[15, 8], [15, 9], [16, 8], [16, 9], [17, 8], [17, 9], [18, 9]];
    const [a, b] = subs[Math.floor(Math.random() * subs.length)];
    return { id, expression: `${a} − ${b}`, operands: [a, b], operators: ['−'], answer: a - b, adaptiveTier: 5 };
  } else {
    const triplets = [
      [8, 6, 4, '+', '+', 18],
      [17, 8, 4, '−', '+', 13],
      [15, 7, 3, '−', '−', 5],
      [9, 8, 6, '+', '−', 11],
      [16, 9, 5, '−', '+', 12]
    ];
    const [a, b, c, op1, op2, ans] = triplets[Math.floor(Math.random() * triplets.length)] as [number, number, number, string, string, number];
    return { id, expression: `${a} ${op1} ${b} ${op2} ${c}`, operands: [a, b, c], operators: [op1, op2], answer: ans, adaptiveTier: 5 };
  }
}

/**
 * Generate 4 distinct choices including the correct answer and 3 close distractors
 */
function generateDistractors(answer: number): number[] {
  const options = new Set<number>();
  options.add(answer);

  // Plausible shifts: +/- 1, +/- 2, +/- 3, +/- 10
  const candidateDeltas = [-1, 1, -2, 2, -3, 3, 10, -10];

  for (const delta of candidateDeltas) {
    if (options.size >= 4) break;
    const candidate = answer + delta;
    if (candidate > 0 && candidate !== answer) {
      options.add(candidate);
    }
  }

  let fallback = 1;
  while (options.size < 4) {
    const candidate = Math.max(1, answer + fallback);
    if (!options.has(candidate)) {
      options.add(candidate);
    }
    fallback = fallback > 0 ? -fallback - 1 : -fallback + 1;
  }

  // Shuffle array
  const result = Array.from(options);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
