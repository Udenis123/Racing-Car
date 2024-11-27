import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const quizData = {
  1: [
    {
      question: "What does a yellow traffic light mean?",
      type: "text",
      media: null,
      options: [
        "Speed up to get through",
        "Prepare to stop safely",
        "Stop immediately",
        "Ignore it if you're in a hurry"
      ],
      correct: 1
    },
    {
      question: "Identify this road sign:",
      type: "image",
      media: "https://images.unsplash.com/photo-1572831808815-3dd8b0173c69?w=400&h=300&fit=crop",
      options: ["Stop", "Yield", "Merge", "Speed Limit"],
      correct: 1
    },
    {
      question: "What's the proper following distance in good conditions?",
      type: "video",
      media: "https://player.vimeo.com/video/76979871",
      options: ["1 second", "2 seconds", "3 seconds", "5 seconds"],
      correct: 2
    },
    {
      question: "When should you use your turn signals?",
      type: "text",
      media: null,
      options: [
        "Only when turning",
        "Only when changing lanes",
        "When turning or changing lanes",
        "Only in heavy traffic"
      ],
      correct: 2
    },
    {
      question: "Identify the correct parking technique:",
      type: "image",
      media: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=400&h=300&fit=crop",
      options: [
        "Parallel parking",
        "Angle parking",
        "Perpendicular parking",
        "Double parking"
      ],
      correct: 0
    },
    {
      question: "What's the speed limit in a residential area?",
      type: "text",
      media: null,
      options: ["15 mph", "25 mph", "35 mph", "45 mph"],
      correct: 1
    }
  ],
  2: [
    {
      question: "What does this road marking mean?",
      type: "image",
      media: "https://images.unsplash.com/photo-1566996533071-2c578080c06e?w=400&h=300&fit=crop",
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
      type: "video",
      media: "https://player.vimeo.com/video/76979871",
      options: ["High beams", "Low beams", "Hazard lights", "No lights"],
      correct: 1
    },
    {
      question: "Identify the correct tire pressure gauge reading:",
      type: "image",
      media: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop",
      options: ["28 PSI", "32 PSI", "36 PSI", "40 PSI"],
      correct: 1
    }
  ],
  3: [
    {
      question: "What should you do if hydroplaning?",
      type: "video",
      media: "https://player.vimeo.com/video/76979871",
      options: [
        "Brake hard",
        "Turn sharply",
        "Ease off gas and steer straight",
        "Accelerate"
      ],
      correct: 2
    },
    {
      question: "Identify the correct hand position:",
      type: "image",
      media: "https://images.unsplash.com/photo-1574027542338-98e75acfd385?w=400&h=300&fit=crop",
      options: ["12 and 6", "10 and 2", "9 and 3", "8 and 4"],
      correct: 2
    },
    {
      question: "What's the first thing to do at the scene of an accident?",
      type: "text",
      media: null,
      options: [
        "Call your insurance",
        "Take photos",
        "Ensure safety/call emergency services",
        "Leave quickly"
      ],
      correct: 2
    }
  ]
};

interface QuizProps {
  level: number;
  onComplete: (passed: boolean) => void;
}

export default function Quiz({ level, onComplete }: QuizProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Randomly select 5 questions from the level's question pool
    const levelQuestions = quizData[level as keyof typeof quizData];
    const shuffled = [...levelQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 5));
  }, [level]);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    const correctAnswers = answers.filter(
      (answer, index) => answer === questions[index].correct
    ).length;
    return (correctAnswers / questions.length) * 100;
  };

  if (questions.length === 0) {
    return <div className="text-center">Loading questions...</div>;
  }

  if (showResults) {
    const score = calculateScore();
    const passed = score >= 60;

    return (
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <div className="text-center">
          {passed ? (
            <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-500" />
          ) : (
            <XCircle className="w-20 h-20 mx-auto mb-4 text-red-500" />
          )}
          <h2 className="text-3xl font-bold mb-4">Quiz Results</h2>
          <p className="text-2xl mb-4">Your score: {score}%</p>
          <p className="text-xl mb-6">
            {passed 
              ? "Congratulations! You passed!" 
              : "Sorry, you need 60% to pass. Try again!"}
          </p>
          <button
            onClick={() => onComplete(passed)}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors"
          >
            {passed ? "Continue to Next Level" : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-2xl w-full">
      <div className="mb-8">
        <h2 className="text-xl mb-4">Question {currentQuestion + 1} of {questions.length}</h2>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl mb-6">{question.question}</h3>

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
      </div>

      <div className="space-y-4">
        {question.options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className="w-full p-4 text-left bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}