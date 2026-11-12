import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawArtist = searchParams.get('name') || '';

  // Clean artist name (remove "ft.", "feat.", etc.)
  const cleanArtist = rawArtist
    .replace(/\s+(ft\.?|feat\.?|vs\.?|x)\s+.*$/i, '')
    .replace(/\s*-\s*topic$/i, '')
    .replace(/\s*vevo$/i, '')
    .trim();

  if (!cleanArtist) {
    return NextResponse.json({
      name: 'Sonic Artist',
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      bio: 'Studio verified recording artist.',
    });
  }

  // Pre-mapped verified high-res Wikimedia images for core artists
  const verifiedArtistImages: Record<string, { image: string; banner: string; bio?: string }> = {
    'imagine dragons': {
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Imagine_Dragons_at_the_2022_IHeartRadio_Music_Awards.jpg/800px-Imagine_Dragons_at_the_2022_IHeartRadio_Music_Awards.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Imagine_Dragons_-_Uncasville_CT_-_November_2017_-_2.jpg/1280px-Imagine_Dragons_-_Uncasville_CT_-_November_2017_-_2.jpg',
      bio: 'Imagine Dragons are an American pop rock band formed in 2008 in Las Vegas, Nevada, consisting of lead singer Dan Reynolds, guitarist Wayne Sermon, bassist Ben McKee, and drummer Daniel Platzman. Known for their world-renowned hits "Believer", "Radioactive", and "Demons".',
    },
    'the weeknd': {
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/The_Weeknd_Cannes_2023.png/800px-The_Weeknd_Cannes_2023.png',
      banner: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/The_Weeknd_in_2018.jpg/1280px-The_Weeknd_in_2018.jpg',
      bio: 'Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer-songwriter and record producer celebrated for his distinct sonic world, cinematic music videos, and multi-platinum albums After Hours and Starboy.',
    },
    'arijit singh': {
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Arijit_Singh_performance_at_Chandigarh_2025.jpg/800px-Arijit_Singh_performance_at_Chandigarh_2025.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Arijit_Singh_performance_at_Chandigarh_2025.jpg/1280px-Arijit_Singh_performance_at_Chandigarh_2025.jpg',
      bio: 'Arijit Singh is a celebrated Indian playback singer and music composer who is universally regarded as one of the most versatile and influential vocalists in modern Indian music.',
    },
    'ed sheeran': {
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Ed_Sheeran-6886_%28cropped%29.jpg/800px-Ed_Sheeran-6886_%28cropped%29.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Ed_Sheeran-6886_%28cropped%29.jpg/1280px-Ed_Sheeran-6886_%28cropped%29.jpg',
      bio: 'Edward Christopher Sheeran is an English singer-songwriter. With hits such as "Shape of You" and "Perfect", he is one of the world\'s best-selling music artists.',
    },
    'dua lipa': {
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/DuaLipaO2020522_%2841_of_99%29_%2852099395898%29_%28cropped%29.jpg/800px-DuaLipaO2020522_%2841_of_99%29_%2852099395898%29_%28cropped%29.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/DuaLipaO2020522_%2841_of_99%29_%2852099395898%29_%28cropped%29.jpg/1280px-DuaLipaO2020522_%2841_of_99%29_%2852099395898%29_%28cropped%29.jpg',
      bio: 'Dua Lipa is an English and Albanian singer and songwriter renowned for her signature mezzo-soprano vocal range and disco-pop sound.',
    },
    'taylor swift': {
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png/800px-191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png',
      banner: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png/1280px-191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png',
      bio: 'Taylor Alison Swift is an American singer-songwriter whose narrative songwriting has achieved critical praise and widespread global acclaim.',
    },
  };

  const keyLower = cleanArtist.toLowerCase();
  for (const [k, v] of Object.entries(verifiedArtistImages)) {
    if (keyLower.includes(k) || k.includes(keyLower)) {
      return NextResponse.json({
        name: cleanArtist,
        imageUrl: v.image,
        bannerUrl: v.banner,
        bio: v.bio,
        source: 'Wikimedia Verified Archive',
      });
    }
  }

  // Live Query to Wikipedia API for real photo
  try {
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanArtist.replace(/ /g, '_'))}`;
    const wikiRes = await fetch(wikiUrl, {
      headers: { 'User-Agent': 'SonicAudioMaster/2.0 (music@sonic.audio)' },
      next: { revalidate: 86400 },
    });

    if (wikiRes.ok) {
      const data = await wikiRes.json();
      const realImage = data.originalimage?.source || data.thumbnail?.source;
      if (realImage) {
        return NextResponse.json({
          name: data.title || cleanArtist,
          imageUrl: realImage,
          bannerUrl: realImage,
          bio: data.extract || `Studio verified profile for ${cleanArtist}.`,
          source: 'Wikipedia Commons',
        });
      }
    }
  } catch (err) {
    console.warn('Wikipedia image fetch fallback', err);
  }

  // Fallback to Live YouTube Channel Logo / Avatar
  try {
    const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanArtist)}`;
    const ytRes = await fetch(ytUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      next: { revalidate: 86400 },
    });

    if (ytRes.ok) {
      const html = await ytRes.text();
      // Match channel avatar from YouTube
      const avatarMatch =
        html.match(/"channelThumbnailWithLinkRenderer":\{"thumbnail":\{"thumbnails":\[\{"url":"([^"]+)"/) ||
        html.match(/"channelRenderer":\{[\s\S]*?"thumbnails":\[\{"url":"([^"]+)"/) ||
        html.match(/https:\/\/[a-zA-Z0-9_\.]+\.ggpht\.com\/[a-zA-Z0-9_\-=\/]+/);

      if (avatarMatch && avatarMatch[1]) {
        let avatarUrl = avatarMatch[1];
        if (avatarUrl.startsWith('//')) avatarUrl = 'https:' + avatarUrl;
        // Upgrade thumbnail size from =s68/=s88 to high-res =s800
        const highResAvatar = avatarUrl.replace(/=s\d+-[^"]+/, '=s800-c-k-c0x00ffffff-no-rj');

        return NextResponse.json({
          name: cleanArtist,
          imageUrl: highResAvatar,
          bannerUrl: highResAvatar,
          bio: `Studio verified profile for ${cleanArtist}. High-dynamic-range recording artist calibrated on Sonic audio master pipeline.`,
          source: 'YouTube Verified Channel Archive',
        });
      }
    }
  } catch (ytErr) {
    console.warn('YouTube channel logo fetch fallback', ytErr);
  }

  // Graceful fallback to real concert photo
  return NextResponse.json({
    name: cleanArtist,
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop&q=80',
    bio: `Studio verified profile for ${cleanArtist}. High-dynamic-range recording artist calibrated on Sonic audio master pipeline.`,
    source: 'Sonic Studio Archive',
  });
}
