import Chatbot from '@/components/Chatbot';

/**
 * Main page component featuring the eGain chatbot
 */
export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-4xl">
        <Chatbot />
      </div>
    </main>
  );
}
