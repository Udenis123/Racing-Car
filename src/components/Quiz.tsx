import{ useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const quizData = {
  1: [
    {
      question: "What does a yellow traffic light mean?",
      options: [
        "Speed up to get through",
        "Prepare to stop safely",
        "Stop immediately",
        "Ignore it if you're in a hurry"
      ],
      correct: 1
    },
    {
      question: "What's the proper following distance in good conditions?",
      options: [
        "1 second",
        "2 seconds",
        "3 seconds",
        "5 seconds"
      ],
      correct: 2
    },
    {
      question: "When should you use your turn signals?",
      options: [
        "Only when turning",
        "Only when changing lanes",
        "When turning or changing lanes",
        "Only in heavy traffic"
      ],
      correct: 2
    },
    {
      question: "What should you do if your brakes fail?",
      options: [
        "Pump the brakes and use emergency brake",
        "Jump out of the car",
        "Close your eyes",
        "Speed up"
      ],
      correct: 0
    },
    {
      question: "What's the speed limit in a residential area?",
      options: [
        "15 mph",
        "25 mph",
        "35 mph",
        "45 mph"
      ],
      correct: 1
    }
  ],
  2: [
    {
      question: "What does a solid white line between lanes mean?",
      options: [
        "Passing is encouraged",
        "Crossing is discouraged",
        "No traffic allowed",
        "Speed limit zone"
      ],
      correct: 1
    },
    {
      question: "When driving in fog, you should use:",
      options: [
        "High beams",
        "Low beams",
        "Hazard lights",
        "No lights"
      ],
      correct: 1
    },
    {
      question: "What's the main purpose of anti-lock brakes (ABS)?",
      options: [
        "Stop faster",
        "Prevent skidding while braking",
        "Save fuel",
        "Reduce tire wear"
      ],
      correct: 1
    },
    {
      question: "When should you check your blind spots?",
      options: [
        "Before changing lanes",
        "When stopping",
        "Only in bad weather",
        "Never"
      ],
      correct: 0
    },
    {
      question: "What's the proper hand position on the steering wheel?",
      options: [
        "12 and 6",
        "10 and 2",
        "9 and 3",
        "8 and 4"
      ],
      correct: 2
    }
  ],
  3: [
    {
      question: "What should you do if hydroplaning?",
      options: [
        "Brake hard",
        "Turn sharply",
        "Ease off gas and steer straight",
        "Accelerate"
      ],
      correct: 2
    },
    {
      question: "When are you most likely to encounter deer on the road?",
      options: [
        "Dawn and dusk",
        "Noon",
        "Mid-afternoon",
        "Midnight"
      ],
      correct: 0
    },
    {
      question: "What's the first thing to do at the scene of an accident?",
      options: [
        "Call your insurance",
        "Take photos",
        "Ensure safety/call emergency services",
        "Leave quickly"
      ],
      correct: 2
    },
    {
      question: "How often should you check your tire pressure?",
      options: [
        "Once a year",
        "Monthly",
        "Never",
        "Only when flat"
      ],
      correct: 1
    },
    {
      question: "What's the recommended tire tread depth minimum?",
      options: [
        "2/32 inch",
        "4/32 inch",
        "6/32 inch",
        "8/32 inch"
      ],
      correct: 0
    }
  ]
};

interface QuizProps {
  level: number;
  onComplete: (passed: boolean) => void;
}

export default function Quiz({ level, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < quizData[level as keyof typeof quizData].length - 1) {
      setCurrentQuestion(c => c + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    const correctAnswers = answers.filter(
      (answer, index) => answer === quizData[level as keyof typeof quizData][index].correct
    ).length;
    return (correctAnswers / quizData[level as keyof typeof quizData].length) * 100;
  };

  if (showResults) {
    const score = calculateScore();
    const passed = score >= 60;

    return (
      <div className="bg-gray-800 p-8  lg:h-[490px] rounded-lg max-w-2xl w-full">
        <div className="text-center">
          {passed ? (
            <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-500" />
          ) : (
            <XCircle className="w-20 h-20 mx-auto mb-4 text-red-500" />
          )}
          <h2 className="text-2xl mb-4">Quiz Results</h2>
          <p className="text-xl mb-4">Your score: {score}%</p>
          <p className="mb-4">
            {passed ? "Congratulations! You passed!" : "Sorry, you need 60% to pass. Try again!"}
          </p>
          <button
            onClick={() => onComplete(passed)}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
          >
            {passed ? "Continue to Next Level" : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  const question = quizData[level as keyof typeof quizData][currentQuestion];

  return (
    <div className="bg-gray-800 p-8 rounded-lg max-w-2xl w-full">
      <div className="mb-6">
        <h2 className="text-xl mb-2">Question {currentQuestion + 1} of {quizData[level as keyof typeof quizData].length}</h2>
        <div className="h-2 bg-gray-700 rounded-full">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${(currentQuestion / quizData[level as keyof typeof quizData].length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h3 className="text-xl mb-6">{question.question}</h3>

      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className="w-full p-4 text-left bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}