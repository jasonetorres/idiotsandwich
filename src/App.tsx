import { useState } from 'react';
import { ChefHat as Chef, Trash2, Star, StarOff } from 'lucide-react';
import OpenAI from 'openai';
import RoastButton from './RoastButton';

type FeedbackType = {
  section: string;
  comment: string;
};

// Gordon Ramsay reaction GIFs for different ratings
const GORDON_GIFS = {
  terrible: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDZ6dGFiaXRqc3JqMWxwc3FzajV1c2w1a3FtcHl0bDIwaWMxZXE2YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o85g2ttYzgw6o661q/giphy.gif", // Idiot sandwich
  bad: "https://media.giphy.com/media/2kMQiSEW6Wkyh3YltH/giphy.gif?cid=790b7611s7gt5ui8e5zcyfzgqwyb8hib4o7liwbpo9hc1eg4&ep=v1_gifs_search&rid=giphy.gif&ct=g", // IT'S RAW
  average: "https://media.giphy.com/media/3o6ZtpvPW6fqxkE1xu/giphy.gif?cid=ecf05e47ahkihrnterpdo416b7xmcdteo7flc88kbcfev9uj&ep=v1_gifs_search&rid=giphy.gif&ct=g", // Disappointed but not angry
  good: "https://media.giphy.com/media/TIMB8bgHa1mb41tMaS/giphy.gif?cid=790b7611s7gt5ui8e5zcyfzgqwyb8hib4o7liwbpo9hc1eg4&ep=v1_gifs_search&rid=giphy.gif&ct=g", // Finally, some good food
  excellent: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExczdndDV1aThlNXpjeWZ6Z3F3eWI4aGliNG83bGl3YnBvOWhjMWVnNCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l0MYyoYPvz22wTXkQ/giphy.gif" // Perfect, happy Gordon
};

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

function App() {
  const [resumeText, setResumeText] = useState('');
  const [feedback, setFeedback] = useState<FeedbackType[]>([]);
  const [isRoasting, setIsRoasting] = useState(false);
  const [rating, setRating] = useState<number>(0);

  const getGifByRating = (rating: number): string => {
    if (rating <= 1) return GORDON_GIFS.terrible;
    if (rating <= 2) return GORDON_GIFS.bad;
    if (rating <= 3) return GORDON_GIFS.average;
    if (rating <= 4) return GORDON_GIFS.good;
    return GORDON_GIFS.excellent;
  };

  const getRatingText = (rating: number): string => {
    if (rating <= 1) return "YOU'RE AN IDIOT SANDWICH!";
    if (rating <= 2) return "IT'S BLOODY RAW!";
    if (rating <= 3) return "IT'S DECENT, BUT I'VE SEEN BETTER!";
    if (rating <= 4) return "NOW THAT'S MORE LIKE IT!";
    return "ABSOLUTELY BRILLIANT!";
  };

  const analyzeResume = async (text: string) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are Gordon Ramsay reviewing resumes. Be brutally honest but constructive, using cooking metaphors and Gordon's signature style. Analyze the resume for issues with formatting, content, clarity, and impact. Break down your analysis into sections (Experience, Skills, Education, etc.). Use ALL CAPS for emphasis like Gordon does. Keep each section's feedback concise but impactful. At the end, provide a rating from 1-5 stars, where 1 is terrible and 5 is excellent. Format the rating as 'RATING: X/5'."
          },
          {
            role: "user",
            content: `Please analyze this resume and provide feedback in Gordon Ramsay's style:\n\n${text}`
          }
        ],
        temperature: 0.8,
        max_tokens: 1000
      });

      const analysis = response.choices[0].message.content;
      if (!analysis) throw new Error("No analysis received");

      // Extract rating from the analysis
      const ratingMatch = analysis.match(/RATING:\s*(\d+)\/5/);
      const extractedRating = ratingMatch ? parseInt(ratingMatch[1]) : 3;
      setRating(extractedRating);

      // Split the analysis into sections and format as feedback
      const sections = analysis.split('\n\n').filter(section => !section.includes('RATING:'));
      return sections.map(section => {
        const [title, ...content] = section.split('\n');
        return {
          section: title.replace(':', ''),
          comment: content.join('\n')
        };
      });
    } catch (error: any) {
      console.error('Error analyzing resume:', error);
      throw error;
    }
  };

  const roastResume = async () => {
    if (!resumeText.trim()) {
      alert("WHERE'S THE RESUME?! I NEED SOMETHING TO WORK WITH, YOU DONUT!");
      return;
    }

    setIsRoasting(true);
    try {
      const analysis = await analyzeResume(resumeText);
      setFeedback(analysis);
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage = error.error?.code === 'insufficient_quota'
        ? "BLOODY HELL! The kitchen's run out of gas! Our API quota is exhausted. Try again later or use a different API key!"
        : "BLOODY HELL! The kitchen's on fire! Something went wrong with the analysis.";
      
      setFeedback([{
        section: 'Error',
        comment: errorMessage
      }]);
    } finally {
      setIsRoasting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-500 via-orange-700 to-red-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-8">
          <Chef className="w-12 h-12" />
          <h1 className="text-4xl font-bold">Gordon's Resume Roast</h1>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8 shadow-lg">
          <div className="mb-4">
            <label className="block text-lg mb-2">Paste Your Resume Here, YOU DONKEY!</label>
            <textarea
              className="w-full h-64 p-4 bg-white/5 rounded-lg border border-red-400 text-white placeholder-red-300"
              placeholder="Paste your resume content here... AND MAKE IT GOOD!"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
          <RoastButton roastResume={roastResume} isRoasting={isRoasting} />
            
            <button
              onClick={() => {
                setResumeText('');
                setFeedback([]);
                setRating(0);
              }}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Clear
            </button>
          </div>
        </div>

        {feedback.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">The Dish</h2>
            <div className="space-y-4">
              {feedback.map((item, index) => (
                <div key={index} className="bg-red-900/50 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">{item.section}</h3>
                  <p className="italic whitespace-pre-line">{item.comment}</p>
                </div>
              ))}
              
              {rating > 0 && (
                <div className="mt-8 text-center">
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      star <= rating ? (
                        <Star key={star} className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                      ) : (
                        <StarOff key={star} className="w-8 h-8 text-gray-400" />
                      )
                    ))}
                  </div>
                  <p className="text-xl font-bold mb-4">{getRatingText(rating)}</p>
                  <div className="max-w-sm mx-auto">
                    <img 
                      src={getGifByRating(rating)} 
                      alt="Gordon's Reaction" 
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="mt-8 text-center text-sm text-red-300">
          <p>Disclaimer: This is a parody app. Gordon Ramsay isn't actually reviewing your resume, you donut, 🍩 its me Jason Torres 2025 &copy;</p>
        </footer>
      </div>
    </div>
  );
}

export default App;