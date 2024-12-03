import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { cover } from 'three/src/extras/TextureUtils.js';


const quizData = {
  1: [
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
  2: [
    {
      question: "Iki cyapa gisobanura iki?",
      type: "image",
      media: "https://media.istockphoto.com/id/452240089/vector/no-entry-german-road-sign.jpg?s=612x612&w=0&k=20&c=2OOVqYE-tuTMLfi89LT9-DAOkMzYuu0NZ7ToGUnsjuE=",
      options: [
        "Ntihanyurwa",
        "Komeza w'igengesereye",
        "Si njye kireba",
        "Inkomane imbere"
      ],
      correct: 0
    },
    {
      question: "Iyo uri gutwara mu gihu ukwiye gucana aya matara:",
      type: "text",
      media: null,
      options: ["Amaremare", "Amagufi", "Y'imbere mu kinyabiziga", "Si ngombwa kuyacana"],
      correct: 1
    },
    {
      question: "Iki cyapa kiri mubuhe bwoko bw'ibyapa?:",
      type: "image",
      media: "https://grammarvocab.com/wp-content/uploads/2022/11/Road-Work-Signs.png?w=400&h=300&fit=crop",
      options: ["Ibibuza", "Ibitegeka", "Ibiburira", "Ibiyobora"],
      correct: 2
    }
  ],
  3: [
    {
      question: "Wakora iki ugeze mu masangano harimo itara ry'umuhondo mu bimenyetso bimurika?",
      type: "image",
      media: "https://cdn-hhemp.nitrocdn.com/CzTrBAAAQEDiquGqUnZSWpxDsbIQwMVJ/assets/images/optimized/rev-059b1fc/www.phoenixlawteam.com/wp-content/uploads/2024/01/yellow-traffic-light.jpg?w=400&h=300&fit=crop",
      options: [
        "Ihute kuko henda kujyamo umutuku",
        "hita uhagarara aho ugeze",
        "Komeza witegura guhagarara cyangwa uhagarara niba utateza ibyago"
        
      ],
      correct: 2
    },
    {
      question: "Mu bitegekwa n’umukozi ubifitiye ububasha ukuboko kuzamuye gutegeka ibi bikurikira:",
      type: "image",
      media: "https://www.highwaycodeuk.co.uk/uploads/3/2/9/2/3292309/published/traffic-approaching-from-the-front.jpg?1490721655?w=400&h=90",
      options: ["Abagenzi bose bagomba guhagarara",
                "Abagenzi bose bagomba guhagarara uretse abageze mu isangano", 
                "Abaturuka imbere ye nibo bahagarara", 
                "Nta gisubizo cy’ukuri kirimo"
              
      ],
      correct: 1
    },
    {
      question: "Wakora iki ugeze bwa mbere aho impanuka yabereye?",
      type: "text",
      media: null,
      options: [
        "Kwihutira gukura mu kinyabiziga uwakoze impanuka",
        "Guhumuriza uwakoze impanuka umuha icyo kunywa gikonje",
        "Guahamagara abashinzwe ubutabazi no kwegezayo uwakoze impanuka mu gihe hari ibyago by'inkongi y'umuriro",
        "Kujya kubaza uwakoze impanuka aho ababara"
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
              style={{ width: '100%',objectFit:'scale-down'}}
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