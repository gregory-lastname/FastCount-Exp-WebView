interface TenFrameProps {
  a: number;
  b: number;
  operator: '+' | '-';
  showAnswer?: boolean;
}

export function TenFrame({ a, b, operator, showAnswer }: TenFrameProps) {
  // Visual representation of up to 10 dots (standard primary school "Десятичный блок" / ten-frame)
  // Two rows of 5 slots
  const total = operator === '+' ? a + b : a;

  return (
    <div className="flex flex-col items-center gap-1.5 p-3 bg-amber-50/80 border border-amber-200 rounded-2xl max-w-sm mx-auto shadow-inner">
      <div className="text-xs font-semibold text-amber-800">
        Наглядный счёт (десятичный блок):
      </div>
      <div className="grid grid-cols-5 gap-2 p-2 bg-white rounded-xl border border-amber-200">
        {Array.from({ length: 10 }).map((_, index) => {
          let dotColor = 'border-dashed border-2 border-slate-200 bg-slate-50'; // empty slot

          if (operator === '+') {
            if (index < a) {
              dotColor = 'bg-amber-500 border-2 border-amber-600 shadow-sm';
            } else if (index < a + b) {
              dotColor = 'bg-indigo-600 border-2 border-indigo-700 shadow-sm';
            }
          } else {
            // Subtraction: a dots in total, with b crossed out
            if (index < a - b) {
              dotColor = 'bg-amber-500 border-2 border-amber-600 shadow-sm';
            } else if (index < a) {
              dotColor = 'bg-indigo-300 border-2 border-indigo-400 opacity-60';
            }
          }

          return (
            <div
              key={index}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${dotColor}`}
            >
              {operator === '-' && index >= a - b && index < a && (
                <span className="text-indigo-950 text-xs font-black">✕</span>
              )}
            </div>
          );
        })}
      </div>
      {showAnswer && (
        <div className="text-xs text-slate-700 font-semibold">
          {operator === '+' ? (
            <span>
              <strong className="text-amber-700 font-black">{a}</strong> оранжевых +{' '}
              <strong className="text-indigo-700 font-black">{b}</strong> фиолетовых ={' '}
              <strong className="text-slate-900 font-black">{total}</strong>
            </span>
          ) : (
            <span>
              Было <strong className="text-amber-700 font-black">{a}</strong>, убрали{' '}
              <strong className="text-indigo-700 font-black">{b}</strong>, осталось{' '}
              <strong className="text-slate-900 font-black">{a - b}</strong>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
