import { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';

const initialQuestions = [
  {
    question: "Ijambo”akagarurarumuri” bivuga akantu karabagirana gasubiza imirasire y’urumuri:",
    type: "text",
    media: null,
    options: [
      "ku kintu kirabagirana",
      "Ku kintu kiyohereje",
      "ku mpande z’inzira nyabagendwa"
    ],
    correct: 1
  },
  {
    question: "Iki cyapa gisobanuye iki?:",
    type: "image",
    media: "https://i0.wp.com/printex.co.za/wp-content/uploads/2023/03/Yield-Road-Sign.png?fit=1024%2C1024&ssl=1",
    options: [
      "Hagarara",
      "Tanga inzira",
      "Ihute baraguha inzira",
      "Ntihanyurwa"
    ],
    correct: 1
  },
  {
    question: "Ni iki ukwiye kwitondera mbere yo guhaguruka?",
    type: "text",
    media: null,
    options: [
      "Uko essance ingana",
      "Ntacyo , Ihagurukire",
      "Indorerwamo, Umukandara, Ibindi bigukikije",
      "Sitasiyo ya radiyo ivuga neza"
    ],
    correct: 2
  },
  {
    question: "Ni ikihe gice cy'umuhanda ukwiye kujjyamo mu gihe ushaka gukata i buryo?",
    type: "text",
    media: null,
    options: [
      "Ikiri ibumoso",
      "Ikiri hagati",
      "Ikiri iburyo",
      "Icyaricyo cyose"
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
        <h2 className="text-3xl font-bold text-white mb-2">Isuzuma ku mategeko n'amabwiriza yo mu muhanda</h2>
        <p className="text-gray-400">Isuzume mbere yo gutangira gutwara</p>
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