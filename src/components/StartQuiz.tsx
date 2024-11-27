import { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';

const initialQuestions = [
  {
    question: "What is the most important rule of safe driving?",
    type: "text",
    media: null,
    options: [
      "Always maintain speed",
      "Stay alert and focused",
      "Use horn frequently",
      "Race with others"
    ],
    correct: 1
  },
  {
    question: "Identify this traffic sign:",
    type: "image",
    media: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop",
    options: [
      "Stop sign",
      "Yield sign",
      "Speed limit",
      "No entry"
    ],
    correct: 0
  },
  {
    question: "What should you check before starting to drive?",
    type: "video",
    media: "https://player.vimeo.com/video/76979871",
    options: [
      "Only fuel level",
      "Nothing, just start driving",
      "Mirrors, seatbelt, and surroundings",
      "Radio stations"
    ],
    correct: 2
  },
  {
    question: "Which lane position is correct for turning right?",
    type: "image",
    media: "https://images.unsplash.com/photo-1597037203822-2c48ac1b0f5b?w=400&h=300&fit=crop",
    options: [
      "Left lane",
      "Middle lane",
      "Right lane",
      "Any lane"
    ],
    correct: 2
  }
];

interface StartQuizProps {
  onComplete: (passed: boolean) => void;
}

export default function StartQuiz({ onComplete }: StartQuizProps) {
  const [questions, setQuestions] = useState<typeof initialQuestions>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Randomly select 2 questions from the pool
    const shuffled = [...initialQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 2));
  }, []);

  const handleAnswer = (answerIndex: number) => {
    const isCorrect = answerIndex === questions[currentQuestion].correct;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1);
    } else {
      const passed = newScore === questions.length;
      onComplete(passed);
    }
  };

  if (questions.length === 0) {
    return <div className="text-center">Loading questions...</div>;
  }

  const question = questions[currentQuestion];

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-2xl w-full">
      <div className="text-center mb-8">
        <Brain className="w-16 h-16 mx-auto mb-4 text-blue-500" />
        <h2 className="text-3xl font-bold text-white mb-2">Safe Driving Quiz</h2>
        <p className="text-gray-400">Test your knowledge before hitting the road</p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl text-white mb-6">{question.question}</h3>
        
        {question.type === "image" && question.media && (
          <div className="mb-6">
            <img 
              src={question.media} 
              alt="Question visual"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          </div>
        )}

        {question.type === "video" && question.media && (
          <div className="mb-6">
            <iframe
              src={question.media}
              className="w-full aspect-video rounded-lg mb-4"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="w-full p-4 text-left bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white font-medium"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentQuestion ? 'bg-blue-500' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}