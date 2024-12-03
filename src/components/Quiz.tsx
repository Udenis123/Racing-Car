import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const quizData = {
  2: [
    {
      question: "Ijambo” itara ndanga cyerekezo cg ikinyoteri” bivuga itara ry’ikinyabiziga rigenewe kwereka abandi bagenzi ko umuyobozi ashaka kugana :",
      type: "text",
      media: null,
      options: [
        "iburyo",
        "ibumoso",
        "Ku ruhande uru n'uru",
        "iburyo cyangwa ibumoso"
      ],
      correct: 3
    },
    {
      question: "Ikinyabiziga cyose cg ibinyabiziga bikururana,iyo bigenda bigomba kugira :",
      type: "text",
      media: null,
      options: [
        "Ikibiranga",
        "Imyanya yo kwicarwamo",
        "Ubiyobora",
        "Ntagisubizo cy’ukuri kirimo"
      ],
      correct: 2
    },
    {
      question: "Ntawe ushobora gutwara ikinyabiziga kigendeshwa na moteur mu nzira nyabagendwa adafite kandi atitwaje uruhushya rwo gutwara ibinyabiziga rwatanzwe na:",
      type: "text",
      media: null,
      options: [
        "Prokireri wa Republika",
        "Ministri ushinzwe gutwara abantu n’ibintu",
        "Komite y’igihugu ishinzwe umutekano mu muhanda",
        "Police y’igihugu"
      ],
      correct: 3
    },
    {
      question: "Ni ryari ukwiye gukoresha amatara ndanga cyerekezo cg ikinyoteri?",
      type: "text",
      media: null,
      options: [
        "Iyo ugiye gukata gusa",
        "Iyo uri guhinduranya ibisate by'umuhanda gusa",
        "Iyo ugiye gukata cyangwa guhindura igisate cy'umuhanda",
        "iyo uri mu muvundo w'ibinyabiziga gusa"
      ],
      correct: 2
    },
    
  ],
  1: [
    {
      question: "Iki cyapa gisobanura iki?",
      type: "image",
      media: "https://cbx-prod.b-cdn.net/COLOURBOX50956207.jpg?width=800&height=800&quality=70&fit=cover",
      options: [
        "Ntihanyurwa",
        "Komeza w'igengesereye",
        "Si njye kireba",
        "Inkomane imbere"
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
        <h2 className="text-xl mb-4">Ikibazo cya {currentQuestion + 1} muri {questions.length}</h2>
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