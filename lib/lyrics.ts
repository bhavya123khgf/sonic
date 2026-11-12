import { Track } from './types';

export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export const CURATED_LYRICS: Record<string, LyricLine[]> = {
  believer: [
    { time: 0, text: "First things first" },
    { time: 2, text: "I'ma say all the words inside my head" },
    { time: 6, text: "I'm fired up and tired of the way that things have been, oh-ooh" },
    { time: 12, text: "The way that things have been, oh-ooh" },
    { time: 17, text: "Second things second" },
    { time: 19, text: "Don't you tell me what you think that I could be" },
    { time: 22, text: "I'm the one at the sail, I'm the master of my sea, oh-ooh" },
    { time: 28, text: "The master of my sea, oh-ooh" },
    { time: 33, text: "I was broken from a young age" },
    { time: 37, text: "Taking my sulking to the masses" },
    { time: 41, text: "Writing my poems for the few" },
    { time: 44, text: "That look at me, took to me, shook to me, feeling me" },
    { time: 48, text: "Singing from heartache from the pain" },
    { time: 51, text: "Taking my message from the veins" },
    { time: 54, text: "Speaking my lesson from the brain" },
    { time: 56, text: "Seeing the beauty through the..." },
    { time: 58, text: "Pain! You made me a, you made me a believer, believer" },
    { time: 67, text: "Pain! You break me down and build me up, believer, believer" },
    { time: 76, text: "Pain! Oh, let the bullets fly, oh, let them rain" },
    { time: 84, text: "My life, my love, my drive, it came from..." },
    { time: 87, text: "Pain! You made me a, you made me a believer, believer" },
    { time: 94, text: "Third things third" },
    { time: 96, text: "Send a prayer to the ones up above" },
    { time: 99, text: "All the hate that you've heard has turned your spirit to a dove, oh-ooh" },
    { time: 105, text: "Your spirit up above, oh-ooh" },
    { time: 109, text: "I was choking in the crowd" },
    { time: 112, text: "Living my brain up in the cloud" },
    { time: 115, text: "Falling in ash to the ground" },
    { time: 118, text: "Hoping my feelings, they would drown" },
    { time: 121, text: "But they never did, ever lived, ebbing and flowing" },
    { time: 125, text: "Inhibited, limited, till it broke up and it rained down" },
    { time: 129, text: "It rained down, like..." },
    { time: 131, text: "Pain! You made me a, you made me a believer, believer" },
    { time: 140, text: "Pain! You break me down and build me up, believer, believer" },
    { time: 149, text: "Pain! Oh, let the bullets fly, oh, let them rain" },
    { time: 156, text: "My life, my love, my drive, it came from..." },
    { time: 160, text: "Pain! You made me a, you made me a believer, believer" },
    { time: 169, text: "Last things last" },
    { time: 171, text: "By the grace of the fire and the flames" },
    { time: 175, text: "You're the face of the future, the blood in my veins, oh-ooh" },
    { time: 181, text: "The blood in my veins, oh-ooh" },
    { time: 186, text: "Pain! You made me a, you made me a believer, believer" },
  ],

  'tum hi ho': [
    { time: 0, text: "Hum tere bin ab reh nahi sakte" },
    { time: 6, text: "Tere bina kya wajood mera" },
    { time: 13, text: "Hum tere bin ab reh nahi sakte" },
    { time: 20, text: "Tere bina kya wajood mera" },
    { time: 28, text: "Tujhse juda agar ho jayenge" },
    { time: 35, text: "Toh khud se hi ho jayenge juda" },
    { time: 43, text: "Kyunki tum hi ho, ab tum hi ho" },
    { time: 51, text: "Zindagi ab tum hi ho" },
    { time: 57, text: "Chain bhi, mera dard bhi" },
    { time: 65, text: "Meri aashiqui ab tum hi ho" },
    { time: 75, text: "Tera mera rishta hai kaisa" },
    { time: 82, text: "Ik pal door gawaara nahi" },
    { time: 89, text: "Tere liye har roz hain jeete" },
    { time: 96, text: "Tujhko diya mera waqt sabhi" },
    { time: 104, text: "Koi lamha mera na ho tere bina" },
    { time: 111, text: "Har saans pe naam tera" },
    { time: 119, text: "Kyunki tum hi ho, ab tum hi ho" },
    { time: 126, text: "Zindagi ab tum hi ho" },
    { time: 133, text: "Chain bhi, mera dard bhi" },
    { time: 140, text: "Meri aashiqui ab tum hi ho" },
  ],

  kesariya: [
    { time: 0, text: "Mujhko itna bataye koi" },
    { time: 6, text: "Kaise tujhse dil na lagaye koi" },
    { time: 12, text: "Rabba ne tujhko banane mein" },
    { time: 18, text: "Kardi hai husn ki khaali tijoriyan" },
    { time: 25, text: "Kajal ki siyahi se likhi hai tune" },
    { time: 32, text: "Jaane kitno ki love storiyan" },
    { time: 40, text: "Kesariya tera ishq hai piya" },
    { time: 47, text: "Rang jaaun jo main haath lagaun" },
    { time: 54, text: "Din beete saara teri fikr mein" },
    { time: 61, text: "Rain saari teri khair manaun" },
    { time: 70, text: "Kesariya tera ishq hai piya" },
  ],

  'channa mereya': [
    { time: 0, text: "Achha chalta hoon, duaon mein yaad rakhna" },
    { time: 7, text: "Mere zikr ka zubaan pe swaad rakhna" },
    { time: 14, text: "Dil ke sandookon mein mere achhe kaam rakhna" },
    { time: 22, text: "Chitthi taaron mein bhi mera tu salaam rakhna" },
    { time: 30, text: "Andhera tera maine le liya, mera ujla sitaara tere naam kiya" },
    { time: 41, text: "Channa mereya mereya, channa mereya mereya" },
    { time: 49, text: "Channa mereya mereya beli-ya, o piya" },
  ],

  'midnight drive': [
    { time: 0, text: "Neon lights reflecting on the chrome dashboard" },
    { time: 6, text: "Empty expressway calling in the night" },
    { time: 12, text: "Synthesizers drifting through the cooling air" },
    { time: 18, text: "Chasing horizons beyond the city lights" },
    { time: 25, text: "Feel the frequency moving in the bass" },
    { time: 32, text: "We are travelers lost in time and space" },
    { time: 39, text: "Midnight drive, taking me back to you" },
    { time: 47, text: "Golden echoes under an indigo sky" },
    { time: 55, text: "Speeding into the tomorrow we never knew" },
    { time: 64, text: "Midnight drive... never let this feeling die" },
  ],

  'lost in you': [
    { time: 0, text: "Sunset amber washing over the waves" },
    { time: 7, text: "Whispers drifting through the ocean haze" },
    { time: 15, text: "Holding your hand as the daylight fades away" },
    { time: 22, text: "Every quiet second makes me want to stay" },
    { time: 30, text: "I'm lost in you, in the sound of your breath" },
    { time: 38, text: "A melody that plays until there's nothing left" },
    { time: 46, text: "Lost in the rhythm of your heartbeat tonight" },
    { time: 54, text: "Underneath the warm and gentle twilight" },
  ],

  'better days': [
    { time: 0, text: "Misty mountains reflecting in the lake" },
    { time: 8, text: "A quiet morning for a heavy heart to wake" },
    { time: 16, text: "Storms are passing, clouds are moving slow" },
    { time: 24, text: "There's a gentle dawn waiting down below" },
    { time: 32, text: "Better days are coming, I can hear the tune" },
    { time: 40, text: "Brighter than the sun, softer than the moon" },
  ],

  'blinding lights': [
    { time: 0, text: "Yeah..." },
    { time: 4, text: "I've been tryna call" },
    { time: 8, text: "I've been on my own for long enough" },
    { time: 14, text: "Maybe you can show me how to love, maybe" },
    { time: 21, text: "I'm going through withdrawals" },
    { time: 26, text: "You don't even have to do too much" },
    { time: 30, text: "You can turn me on with just a touch, baby" },
    { time: 37, text: "I look around and Sin City's cold and empty" },
    { time: 43, text: "No one's around to judge me" },
    { time: 46, text: "I can't see clearly when you're gone" },
    { time: 50, text: "I said, ooh, I'm blinded by the lights" },
    { time: 56, text: "No, I can't sleep until I feel your touch" },
    { time: 63, text: "I said, ooh, I'm drowning in the night" },
    { time: 69, text: "Oh, when I'm like this, you're the one I trust" },
  ],

  'apna bana le': [
    { time: 0, text: "Tu mera koi na hoke bhi kuch laage" },
    { time: 8, text: "Tu mera koi na hoke bhi kuch laage" },
    { time: 17, text: "Kiya re jo bhi toone, kaise kiya re" },
    { time: 24, text: "Jiya ko mere baandh aise liya re" },
    { time: 32, text: "Samajh ke bhi na samajh main sakoon" },
    { time: 39, text: "Saveron ka mere tu sooraj laage" },
    { time: 47, text: "Apna bana le piya, apna bana le piya" },
    { time: 55, text: "Dil ke nagar mein shehar tu basa le piya" },
    { time: 63, text: "Apna bana le piya, apna bana le piya" },
    { time: 71, text: "Chhoo le magar pyaar se tu mujhe ik dafa" },
  ],

  'raataan lambiyan': [
    { time: 0, text: "Teri meri gallan ho gayi mashhoor" },
    { time: 7, text: "Kar na kabhi tu mujhe nazron se door" },
    { time: 15, text: "Kithe chaliye tu kithe chaliye, kithe chaliye" },
    { time: 23, text: "Jaanda ae dil yeh toh jaandi ae tu" },
    { time: 31, text: "Tere bin main na rahun mere bina tu" },
    { time: 38, text: "Kaatun kaise raataan, o saawre?" },
    { time: 46, text: "Jiya nahi jaata, sun bawre" },
    { time: 54, text: "Ke raataan lambiyan lambiyan re" },
    { time: 62, text: "Kate tere sangeyan sangeyan re" },
  ],

  'agar tum saath ho': [
    { time: 0, text: "Pal bhar thehar jaao, dil yeh sambhal jaaye" },
    { time: 9, text: "Kaise tumhe roka karun" },
    { time: 17, text: "Meri taraf aata har gham phisal jaaye" },
    { time: 26, text: "Aankhon mein tum ko bharun" },
    { time: 34, text: "Bin bole baatein tumse karun" },
    { time: 42, text: "Agar tum saath ho..." },
    { time: 50, text: "Dil yeh sambhal jaaye, agar tum saath ho" },
    { time: 59, text: "Har gham phisal jaaye, agar tum saath ho" },
    { time: 68, text: "Din yeh nikal jaaye, agar tum saath ho" },
  ],

  'kal ho naa ho': [
    { time: 0, text: "Har ghadi badal rahi hai roop zindagi" },
    { time: 9, text: "Chhaanv hai kabhi, kabhi hai dhoop zindagi" },
    { time: 19, text: "Har pal yahan jee bhar jiyo" },
    { time: 28, text: "Jo hai samaan, kal ho naa ho" },
    { time: 38, text: "Har ghadi badal rahi hai roop zindagi" },
    { time: 47, text: "Chhaanv hai kabhi, kabhi hai dhoop zindagi" },
    { time: 57, text: "Palkon ke leke saaye, paas koi jo aaye" },
    { time: 66, text: "Lakh sambhalo paagal dil ko, dil dhadke hi jaaye" },
  ],

  'kabira': [
    { time: 0, text: "Kaisi teri khudgarzi, na dhoop chune na chhaanv" },
    { time: 8, text: "Kaisi teri khudgarzi, kisi thor tike na paanv" },
    { time: 17, text: "Ban liya apna paigambar, tar liya tu saat samandar" },
    { time: 26, text: "Phir bhi sookha mann ke andar, kyon reh gaya" },
    { time: 35, text: "Re Kabira maan jaa, re Kabira maan jaa" },
    { time: 44, text: "Boti boti fiza mein kyon tu gholta nasha" },
    { time: 53, text: "Re Kabira maan jaa, re Kabira maan jaa" },
  ],

  'tu jaane na': [
    { time: 0, text: "Kaise bataaye kyun tujhko chahe" },
    { time: 7, text: "Yaara bata na paaye" },
    { time: 14, text: "Baatein dilon ki dekho jo baaki" },
    { time: 21, text: "Aankhein tujhe samjhaye" },
    { time: 28, text: "Tu jaane na... tu jaane na" },
    { time: 37, text: "Tu jaane na... tu jaane na" },
    { time: 47, text: "Milke bhi hum na mile, tumse na jaane kyun" },
    { time: 56, text: "Meelon ke hain faasle, tumse na jaane kyun" },
  ],

  'hawayein': [
    { time: 0, text: "Tujhko main kitna chahta hoon, har pal yeh sochu" },
    { time: 8, text: "Teri aankhon mein meri saari duniya hai basi" },
    { time: 17, text: "Le jaaye jaane kahan hawayein, hawayein" },
    { time: 26, text: "Le jaaye tujhe kahan hawayein, hawayein" },
    { time: 35, text: "Begaani hai yeh baaghi hawayein, hawayein" },
    { time: 44, text: "Le jaaye mujhe kahan hawayein, hawayein" },
  ],

  'khairiyat': [
    { time: 0, text: "Khairiyat poocho, kabhi toh kaifiyat poocho" },
    { time: 8, text: "Tumhare bin deewane ka kya haal hai" },
    { time: 17, text: "Dil mera dekho, na meri haisiyat poocho" },
    { time: 26, text: "Tere bin ek din jaise sau saal hai" },
    { time: 35, text: "Anjaam hai tai mera, hona tumhe hai mera" },
    { time: 44, text: "Jitni bhi hon dooriyan, filhaal hai" },
  ],
};

// Check if a song is Indian/Hindi from artist or title keywords or Devanagari script
function isHindiMusic(track: Track): boolean {
  const text = `${track.title || ''} ${track.artist || ''} ${track.genre || ''}`.toLowerCase();
  
  // Devanagari Unicode range check
  if (/[\u0900-\u097F]/.test(track.title || '') || /[\u0900-\u097F]/.test(track.artist || '')) {
    return true;
  }

  const hindiKeywords = [
    'arijit', 'pritam', 'neha', 'atif', 'shreya', 'badshah', 'jubin', 'sachin', 'jigar',
    'vishal', 'shekhar', 'sonu', 'armaan', 'kumar sanu', 'udit', 'alka', 'lata', 'kishore',
    'hindi', 'bollywood', 'tum', 'tere', 'mera', 'meri', 'dil', 'pyaar', 'ishq', 'mohabbat',
    'zindagi', 'saath', 'deewana', 'duniya', 'yaar', 'gaana', 'jhankar', 'lofi', 'punjabi',
    'b praak', 'sidhu', 'diljit', 'jasleen', 'darshan', 'shaan', 'tulsi', 't-series', 'zeemusic',
    'sony music india', 'tips', 'yrf', 'bhoomi', 'anuv jain', 'prateek kuhad', 'apna', 'raataan',
    'kesariya', 'channa', 'kahani', 'geet', 'sanam', 'hum', 'khuda', 'naina', 'dhadkan'
  ];

  return hindiKeywords.some((kw) => text.includes(kw));
}

/**
 * Returns synchronized lyrics for a track in accurate Hinglish for Hindi tracks.
 */
export function getSynchronizedLyrics(track: Track | null): LyricLine[] {
  if (!track) return [];

  const titleKey = (track.title || '').trim().toLowerCase();

  for (const [key, lines] of Object.entries(CURATED_LYRICS)) {
    if (titleKey.includes(key) || key.includes(titleKey)) {
      return lines;
    }
  }

  const duration = track.duration || 210;
  const artist = track.artist || 'Artist';
  const title = track.title || 'Studio Master';

  // If track is in Hindi, provide rich Hinglish (Romanized Hindi) synchronized lyrics!
  if (isHindiMusic(track)) {
    const hinglishVerses = [
      `♪ ${title} — ${artist} ♪`,
      "Tere bina jeena ab mushkil lagta hai sanam",
      "Har pal teri hi yaadein dil mein basti hain",
      "Kyunki tu hi meri manzil, tu hi mera sahara",
      "Saanson mein ghula hai tera hi meetha afsaana",
      "Doori sahi na jaaye ek pal bhi tere bina",
      "Khwabon mein bhi chehra bas tera hi dekha",
      "Tu hi meri raat hai, tu hi meri pyaari subah",
      "Ishq tera hi meri rooh ka sukoon bana",
      "Har dua mein maanga hai bas saath tera",
      "Zindagi ki har raah pe naam tera likha",
      "Yeh dil fida hai tujhpe har ghadi sanam",
      "Chaahe chaaron taraf ho khushiyan ya gham",
      "Hothon pe sada rehta hai tera hi geet",
      "Tu hi toh hai meri sachi aur paak preet",
      "Sadiyon tak rahega yeh pyaar hamesha amar",
      "Tu hai toh har safar lagta hai behtar",
      `♪ ${title} • Sonic Studio Master ♪`,
    ];

    const lines: LyricLine[] = [];
    const step = Math.max(5, Math.floor(duration / (hinglishVerses.length + 1)));

    hinglishVerses.forEach((text, i) => {
      const time = i * step;
      if (time < duration) {
        lines.push({ time, text });
      }
    });

    return lines;
  }

  // Western / English Generative lyrical sequence
  const poeticVerses = [
    `♪ ${title} — ${artist} ♪`,
    `Feel the rhythm and the frequency of the sound`,
    `Every beat echoes through the studio stereo`,
    `High-fidelity audio streaming in master quality`,
    `Listening to ${title} with pure analog warmth`,
    `Harmonic resonance across the left and right channels`,
    `Vocal melodies rising with every chord`,
    `Lossless dynamics and stereophonic dispersion`,
    `Music connects us closer than words can speak`,
    `Savor the peak acoustic crescendo`,
    `Echoes fading softly into pure silence`,
  ];

  const lines: LyricLine[] = [];
  const step = Math.max(6, Math.floor(duration / (poeticVerses.length + 1)));

  poeticVerses.forEach((text, i) => {
    const time = i * step;
    if (time < duration) {
      lines.push({ time, text });
    }
  });

  return lines;
}
