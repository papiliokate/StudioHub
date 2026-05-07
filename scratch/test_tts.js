const googleTTS = require('google-tts-api');

async function testTTS() {
  const urls = googleTTS.getAllAudioUrls('Hello, I am a test voice.', {
    lang: 'en-GB',
    slow: false,
    host: 'https://translate.google.com',
  });
  console.log('en-GB:', urls[0].url);

  const urls2 = googleTTS.getAllAudioUrls('Hello, I am a test voice.', {
    lang: 'en-US',
    slow: false,
    host: 'https://translate.google.com',
  });
  console.log('en-US:', urls2[0].url);

  const urls3 = googleTTS.getAllAudioUrls('Hello, I am a test voice.', {
    lang: 'en-AU',
    slow: false,
    host: 'https://translate.google.com',
  });
  console.log('en-AU:', urls3[0].url);
}

testTTS();
