
import { TipCalculator } from '@/components/tip-calculator';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-lg">
        <TipCalculator />
      </div>
    </main>
  );
}
