import { useState, useMemo, useEffect } from 'react';
import {
  Heart, Copy, Check, Quote, Bookmark, Search, X, ChevronLeft, ChevronRight,
  Sparkles, Share2, RefreshCw, Filter
} from 'lucide-react';

const QUOTES = [
  // ——————————— MOTIVATION & SUCCESS ———————————
  { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
  { q: "It does not matter how slowly you go as long as you do not stop.", a: "Confucius" },
  { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
  { q: "The future belongs to those who believe in the beauty of their dreams.", a: "Eleanor Roosevelt" },
  { q: "Success is not final, failure is not fatal: it is the courage to continue that counts.", a: "Winston Churchill" },
  { q: "The only impossible journey is the one you never begin.", a: "Tony Robbins" },
  { q: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", a: "Ralph Waldo Emerson" },
  { q: "The best time to plant a tree was 20 years ago. The second best time is now.", a: "Chinese Proverb" },
  { q: "Your time is limited, so don't waste it living someone else's life.", a: "Steve Jobs" },
  { q: "The way to get started is to quit talking and begin doing.", a: "Walt Disney" },
  { q: "Don't watch the clock; do what it does. Keep going.", a: "Sam Levenson" },
  { q: "The secret of getting ahead is getting started.", a: "Mark Twain" },
  { q: "It always seems impossible until it's done.", a: "Nelson Mandela" },
  { q: "Act as if what you do makes a difference. It does.", a: "William James" },
  { q: "What you get by achieving your goals is not as important as what you become.", a: "Zig Ziglar" },
  { q: "The only limit to our realization of tomorrow is our doubts of today.", a: "Franklin D. Roosevelt" },
  { q: "In the middle of every difficulty lies opportunity.", a: "Albert Einstein" },
  { q: "Do what you can, where you are, with what you have.", a: "Theodore Roosevelt" },
  { q: "The harder I work, the luckier I get.", a: "Gary Player" },
  { q: "Push yourself because no one else is going to do it for you.", a: "Unknown" },
  { q: "Great things never come from comfort zones.", a: "Unknown" },
  { q: "Dream big. Work hard. Stay focused.", a: "Unknown" },

  // ——————————— WISDOM & LIFE ———————————
  { q: "The unexamined life is not worth living.", a: "Socrates" },
  { q: "He who has a why to live can bear almost any how.", a: "Friedrich Nietzsche" },
  { q: "Knowing yourself is the beginning of all wisdom.", a: "Aristotle" },
  { q: "The journey of a thousand miles begins with one step.", a: "Lao Tzu" },
  { q: "Life is what happens when you're busy making other plans.", a: "John Lennon" },
  { q: "In three words I can sum up everything I've learned about life: it goes on.", a: "Robert Frost" },
  { q: "The purpose of our lives is to be happy.", a: "Dalai Lama" },
  { q: "Life is really simple, but we insist on making it complicated.", a: "Confucius" },
  { q: "To live is the rarest thing in the world. Most people exist, that is all.", a: "Oscar Wilde" },
  { q: "Be yourself; everyone else is already taken.", a: "Oscar Wilde" },
  { q: "The only thing we have to fear is fear itself.", a: "Franklin D. Roosevelt" },
  { q: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", a: "Aristotle" },
  { q: "The mind is everything. What you think you become.", a: "Buddha" },
  { q: "Simplicity is the ultimate sophistication.", a: "Leonardo da Vinci" },
  { q: "The best revenge is massive success.", a: "Frank Sinatra" },
  { q: "We make a living by what we get, but we make a life by what we give.", a: "Winston Churchill" },
  { q: "Peace comes from within. Do not seek it without.", a: "Buddha" },
  { q: "Happiness is not something ready made. It comes from your own actions.", a: "Dalai Lama" },
  { q: "Man is the only creature who refuses to be what he is.", a: "Albert Camus" },
  { q: "The only way to have a friend is to be one.", a: "Ralph Waldo Emerson" },

  // ——————————— PERSERVERENCE & GRIT ———————————
  { q: "Fall seven times, stand up eight.", a: "Japanese Proverb" },
  { q: "Our greatest glory is not in never falling, but in rising every time we fall.", a: "Confucius" },
  { q: "When you have a dream, you've got to grab it and never let go.", a: "Carol Burnett" },
  { q: "If you can dream it, you can do it.", a: "Walt Disney" },
  { q: "You miss 100% of the shots you don't take.", a: "Wayne Gretzky" },
  { q: "I have not failed. I've just found 10,000 ways that won't work.", a: "Thomas Edison" },
  { q: "Strive not to be a success, but rather to be of value.", a: "Albert Einstein" },
  { q: "The only person you are destined to become is the person you decide to be.", a: "Ralph Waldo Emerson" },
  { q: "Everything you've ever wanted is on the other side of fear.", a: "George Addair" },
  { q: "Whether you think you can or think you can't, you're right.", a: "Henry Ford" },
  { q: "Success usually comes to those who are too busy to be looking for it.", a: "Henry David Thoreau" },
  { q: "Don't be afraid to give up the good to go for the great.", a: "John D. Rockefeller" },
  { q: "I attribute my success to this: I never gave or took any excuse.", a: "Florence Nightingale" },
  { q: "If you're going through hell, keep going.", a: "Winston Churchill" },
  { q: "The man who moves a mountain begins by carrying away small stones.", a: "Confucius" },
  { q: "Courage is grace under pressure.", a: "Ernest Hemingway" },

  // ——————————— MINDSET & ATTITUDE ———————————
  { q: "The greatest discovery of all time is that a person can change his future by merely changing his attitude.", a: "Oprah Winfrey" },
  { q: "Happiness is an attitude. We either make ourselves miserable, or happy and strong.", a: "Francesca Reigler" },
  { q: "You cannot control what happens to you, but you can control your attitude.", a: "Charles R. Swindoll" },
  { q: "Positive anything is better than negative nothing.", a: "Elbert Hubbard" },
  { q: "The only disability in life is a bad attitude.", a: "Scott Hamilton" },
  { q: "Whether you think you can or think you can't, you're right.", a: "Henry Ford" },
  { q: "Your attitude, not your aptitude, will determine your altitude.", a: "Zig Ziglar" },
  { q: "A strong, positive self-image is the best possible preparation for success.", a: "Joyce Brothers" },
  { q: "Change your thoughts and you change your world.", a: "Norman Vincent Peale" },
  { q: "The mind is like a garden. What you plant, you will harvest.", a: "Unknown" },

  // ——————————— TIME & PRESENCE ———————————
  { q: "The two most powerful warriors are patience and time.", a: "Leo Tolstoy" },
  { q: "Lost time is never found again.", a: "Benjamin Franklin" },
  { q: "Time is what we want most but what we use worst.", a: "William Penn" },
  { q: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", a: "Thich Nhat Hanh" },
  { q: "Realize deeply that the present moment is all you ever have.", a: "Eckhart Tolle" },
  { q: "Yesterday is history, tomorrow is a mystery, today is a gift.", a: "Eleanor Roosevelt" },
  { q: "Life is not measured by the number of breaths we take, but by the moments that take our breath away.", a: "Maya Angelou" },
  { q: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", a: "Buddha" },
  { q: "The secret of health for both mind and body is not to mourn for the past, not to worry about the future, but to live the present moment wisely.", a: "Buddha" },
  { q: "Time flies over us, but leaves its shadow behind.", a: "Nathaniel Hawthorne" },

  // ——————————— CREATIVITY & ART ———————————
  { q: "Every child is an artist. The problem is how to remain an artist once we grow up.", a: "Pablo Picasso" },
  { q: "Creativity is intelligence having fun.", a: "Albert Einstein" },
  { q: "The true sign of intelligence is not knowledge but imagination.", a: "Albert Einstein" },
  { q: "Imagination is more important than knowledge.", a: "Albert Einstein" },
  { q: "You can't use up creativity. The more you use, the more you have.", a: "Maya Angelou" },
  { q: "Art washes away from the soul the dust of everyday life.", a: "Pablo Picasso" },
  { q: "The world is but a canvas to the imagination.", a: "Henry David Thoreau" },
  { q: "Creativity takes courage.", a: "Henri Matisse" },
  { q: "The chief enemy of creativity is 'good' sense.", a: "Pablo Picasso" },
  { q: "Art is the lie that enables us to realize the truth.", a: "Pablo Picasso" },
  { q: "Every artist was first an amateur.", a: "Ralph Waldo Emerson" },

  // ——————————— LOVE & COMPASSION ———————————
  { q: "Where there is love there is life.", a: "Mahatma Gandhi" },
  { q: "Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that.", a: "Martin Luther King Jr." },
  { q: "The best and most beautiful things in the world cannot be seen or even touched — they must be felt with the heart.", a: "Helen Keller" },
  { q: "Love all, trust a few, do wrong to none.", a: "William Shakespeare" },
  { q: "The only thing we never get enough of is love.", a: "Henry Miller" },
  { q: "We are most alive when we are in love.", a: "John Keats" },
  { q: "Be the change that you wish to see in the world.", a: "Mahatma Gandhi" },
  { q: "Thousands of candles can be lit from a single candle, and the life of the candle will not be shortened. Happiness never decreases by being shared.", a: "Buddha" },
  { q: "No act of kindness, no matter how small, is ever wasted.", a: "Aesop" },
  { q: "The simplest acts of kindness are by far more powerful than a thousand heads bowing in prayer.", a: "Mahatma Gandhi" },

  // ——————————— BANGLADESHI & BENGALI WISDOM ———————————
  { q: "Let not thy life be like the lamp that burns itself out to give light to others.", a: "Kazi Nazrul Islam" },
  { q: "All that is true, all that is beautiful, all that is good — that is my religion.", a: "Rabindranath Tagore" },
  { q: "Reach high, for stars lie hidden in you. Dream deep, for every dream precedes the goal.", a: "Rabindranath Tagore" },
  { q: "The butterfly counts not months but moments, and has time enough.", a: "Rabindranath Tagore" },
  { q: "I slept and dreamt that life was joy. I awoke and saw that life was service. I acted and behold, service was joy.", a: "Rabindranath Tagore" },
  { q: "Faith is the bird that feels the light when the dawn is still dark.", a: "Rabindranath Tagore" },
  { q: "If you cry because the sun has gone out of your life, your tears will prevent you from seeing the stars.", a: "Kazi Nazrul Islam" },
  { q: "The rebellion of the oppressed is the voice of justice.", a: "Kazi Nazrul Islam" },
  { q: "Education is not preparation for life; education is life itself.", a: "Begum Rokeya" },
  { q: "Nothing is impossible for a willing heart.", a: "Bangladeshi Proverb" },
  { q: "The world is full of magical things patiently waiting for our senses to grow sharper.", a: "Rabindranath Tagore" },
  { q: "Be fearless in the pursuit of what sets your soul on fire.", a: "Bengali Wisdom" },
  { q: "A single moment of patience can save a thousand hours of regret.", a: "Bangladeshi Proverb" },
  { q: "Strength does not come from physical capacity. It comes from an indomitable will.", a: "Sheikh Mujibur Rahman" },
  { q: "The struggle is my life. I will continue until victory.", a: "Sheikh Mujibur Rahman" },
  { q: "We have learned to fly like birds, to swim like fish, but we have not learned the simple art of living together.", a: "Kazi Nazrul Islam" },
  { q: "Where the mind is without fear and the head is held high, into that heaven of freedom, let my country awake.", a: "Rabindranath Tagore" },

  // ——————————— INDIAN WISDOM ———————————
  { q: "The soul is neither born, nor does it ever die.", a: "Bhagavad Gita" },
  { q: "You have the right to perform your actions, but you are not entitled to the fruits of your actions.", a: "Bhagavad Gita" },
  { q: "Change is the law of the universe. You can be a millionaire or a pauper in an instant.", a: "Swami Vivekananda" },
  { q: "Arise! Awake! Stop not until the goal is reached.", a: "Swami Vivekananda" },
  { q: "In a day, when you don't come across any problems — you can be sure that you are traveling in the wrong path.", a: "Swami Vivekananda" },
  { q: "You cannot believe in God until you believe in yourself.", a: "Swami Vivekananda" },
  { q: "Be the change that you wish to see in the world.", a: "Mahatma Gandhi" },
  { q: "An eye for an eye will only make the whole world blind.", a: "Mahatma Gandhi" },
  { q: "Happiness is when what you think, what you say, and what you do are in harmony.", a: "Mahatma Gandhi" },
  { q: "The weak can never forgive. Forgiveness is the attribute of the strong.", a: "Mahatma Gandhi" },
  { q: "First they ignore you, then they laugh at you, then they fight you, then you win.", a: "Mahatma Gandhi" },
  { q: "Strength does not come from winning. Your struggles develop your strengths.", a: "Mahatma Gandhi" },
  { q: "Live as if you were to die tomorrow. Learn as if you were to live forever.", a: "Mahatma Gandhi" },
  { q: "The future depends on what you do today.", a: "Mahatma Gandhi" },
  { q: "We must become the change we want to see.", a: "Mahatma Gandhi" },
  { q: "If I have the belief that I can do it, I shall surely acquire the capacity to do it even if I may not have it at the beginning.", a: "Mahatma Gandhi" },
  { q: "Truth never damages a cause that is just.", a: "Mahatma Gandhi" },
  { q: "Dream is not that which you see while sleeping, it is something that does not let you sleep.", a: "A. P. J. Abdul Kalam" },
  { q: "If you want to shine like a sun, first burn like a sun.", a: "A. P. J. Abdul Kalam" },
  { q: "You have to dream before your dreams can come true.", a: "A. P. J. Abdul Kalam" },
  { q: "Climbing to the top demands strength, whether it is the top of Mount Everest or the top of your career.", a: "A. P. J. Abdul Kalam" },
  { q: "All of us do not have equal talent. But all of us have an equal opportunity to develop our talents.", a: "A. P. J. Abdul Kalam" },
  { q: "Excellence is a continuous process and not an accident.", a: "A. P. J. Abdul Kalam" },
  { q: "The best way to find yourself is to lose yourself in the service of others.", a: "Mahatma Gandhi" },
  { q: "I came from nothing. I have nothing. I will leave nothing. But I will die with the satisfaction that I tried.", a: "Dhirubhai Ambani" },
  { q: "Think like a queen. A queen is not afraid to fail.", a: "Oprah Winfrey" },
  { q: "Don't let yesterday take up too much of today.", a: "Will Rogers" },

  // ——————————— ISLAMIC & SPIRITUAL ———————————
  { q: "The best of you are those who are best to others.", a: "Prophet Muhammad (PBUH)" },
  { q: "The strongest person is not the one who can wrestle, but the one who controls himself in anger.", a: "Prophet Muhammad (PBUH)" },
  { q: "Speak good or remain silent.", a: "Prophet Muhammad (PBUH)" },
  { q: "A good word is charity.", a: "Prophet Muhammad (PBUH)" },
  { q: "Whoever is not grateful to people is not grateful to God.", a: "Prophet Muhammad (PBUH)" },
  { q: "Make things easy, do not make things difficult.", a: "Prophet Muhammad (PBUH)" },
  { q: "The best among you is the one who learns the Quran and teaches it.", a: "Prophet Muhammad (PBUH)" },
  { q: "Seeking knowledge is an obligation upon every Muslim.", a: "Prophet Muhammad (PBUH)" },
  { q: "Kindness is a mark of faith, and whoever is not kind has no faith.", a: "Prophet Muhammad (PBUH)" },
  { q: "Do not be people without minds of your own, saying that if others treat you well you will treat them well.", a: "Prophet Muhammad (PBUH)" },
  { q: "Cleanliness is half of faith.", a: "Prophet Muhammad (PBUH)" },
  { q: "The merciful are shown mercy by the Most Merciful. Be merciful on earth, and you will be shown mercy.", a: "Prophet Muhammad (PBUH)" },
  { q: "Whoever believes in God and the Last Day, let him honor his guest.", a: "Prophet Muhammad (PBUH)" },
  { q: "Patience is the key to relief.", a: "Islamic Proverb" },
  { q: "God does not burden a soul more than it can bear.", a: "The Quran (2:286)" },
  { q: "Indeed, with hardship comes ease.", a: "The Quran (94:6)" },
  { q: "So verily, with the hardship, there is relief.", a: "The Quran (94:5)" },
  { q: "And whoever puts their trust in God, He is sufficient for them.", a: "The Quran (65:3)" },
  { q: "And We have certainly made the Quran easy to remember.", a: "The Quran (54:17)" },

  // ——————————— PERSIAN & SUFI POETRY ———————————
  { q: "The wound is the place where the Light enters you.", a: "Rumi" },
  { q: "You were born with wings. Why prefer to crawl through life?", a: "Rumi" },
  { q: "Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray.", a: "Rumi" },
  { q: "Don't grieve. Anything you lose comes round in another form.", a: "Rumi" },
  { q: "The universe is not outside of you. Look inside yourself; everything that you want, you are already that.", a: "Rumi" },
  { q: "Raise your words, not voice. It is rain that grows flowers, not thunder.", a: "Rumi" },
  { q: "Why should I be unhappy? Every parcel of my being is in full bloom.", a: "Rumi" },
  { q: "What you seek is seeking you.", a: "Rumi" },
  { q: "You are not a drop in the ocean. You are the entire ocean in a drop.", a: "Rumi" },
  { q: "The art of knowing is knowing what to ignore.", a: "Rumi" },
  { q: "Let the beauty of what you love be what you do.", a: "Rumi" },
  { q: "When you let go of who you are, you become who you might be.", a: "Rumi" },
  { q: "The art of knowing is knowing what to ignore.", a: "Rumi" },
  { q: "The moon stays bright when it does not avoid the night.", a: "Rumi" },
  { q: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.", a: "Rumi" },
  { q: "There is a candle in your heart, ready to be kindled. There is a void in your soul, ready to be filled.", a: "Rumi" },
  { q: "Stop acting so small. You are the universe in ecstatic motion.", a: "Rumi" },
  { q: "The moment you accept what troubles you've been given, the door will open.", a: "Rumi" },
  { q: "The only lasting beauty is the beauty of the heart.", a: "Rumi" },
  { q: "Patience is not sitting and waiting, it is foreseeing. It is looking at the thorn and seeing the rose.", a: "Rumi" },
  { q: "Silence is the language of God. All else is poor translation.", a: "Rumi" },
  { q: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", a: "Rumi" },
  { q: "The garden of the world has no limits, except in your mind.", a: "Rumi" },
  { q: "I have been a seeker and I still am, but I stopped asking the books and the stars. I started listening to the teaching of my soul.", a: "Rumi" },
  { q: "Don't be satisfied with stories, how things have gone with others. Unfold your own myth.", a: "Rumi" },
  { q: "Wherever you are, and whatever you do, be in love.", a: "Rumi" },
  { q: "Let yourself be drawn by the stronger pull of that which you truly love.", a: "Rumi" },
  { q: "Wear gratitude like a cloak and it will feed every corner of your life.", a: "Rumi" },
  { q: "Either give me more wine or leave me alone.", a: "Rumi" },
  { q: "The minute I heard my first love story, I started looking for you.", a: "Rumi" },
  { q: "This is love: to fly toward a secret sky, to cause a hundred veils to fall each moment.", a: "Rumi" },
  { q: "Where there is ruin, there is hope for a treasure.", a: "Rumi" },
  { q: "Through love, all that is bitter will be sweet. Through love, all that is copper will be gold.", a: "Rumi" },
  { q: "Be empty of worrying. Think of who created thought!", a: "Rumi" },
  { q: "Don't you know yet? It is your light that lights the world.", a: "Rumi" },
  { q: "I want to sing like the birds sing, not worrying about who hears or what they think.", a: "Rumi" },
  { q: "The guest is more precious than the house.", a: "Persian Proverb" },
  { q: "The moving finger writes, and having writ, moves on.", a: "Omar Khayyam" },
  { q: "A loaf of bread, a jug of wine, and thou beside me singing in the wilderness.", a: "Omar Khayyam" },

  // ——————————— AFRICAN & GLOBAL WISDOM ———————————
  { q: "It takes a village to raise a child.", a: "African Proverb" },
  { q: "The child who is not embraced by the village will burn it down to feel its warmth.", a: "African Proverb" },
  { q: "If you want to go fast, go alone. If you want to go far, go together.", a: "African Proverb" },
  { q: "Smooth seas do not make skillful sailors.", a: "African Proverb" },
  { q: "Education is the most powerful weapon which you can use to change the world.", a: "Nelson Mandela" },
  { q: "It always seems impossible until it's done.", a: "Nelson Mandela" },
  { q: "A winner is a dreamer who never gives up.", a: "Nelson Mandela" },
  { q: "The brave may not live forever, but the cautious do not live at all.", a: "Chinese Proverb" },
  { q: "Patience is a bitter plant, but its fruit is sweet.", a: "Chinese Proverb" },

  // ——————————— JAPANESE WISDOM ———————————
  { q: "Vision without action is a daydream. Action without vision is a nightmare.", a: "Japanese Proverb" },
  { q: "Nanakorobi yaoki — Fall seven times, stand up eight.", a: "Japanese Proverb" },
  { q: "Even a journey of a thousand miles begins with a single step.", a: "Japanese Proverb" },
  { q: "The nail that sticks out gets hammered down.", a: "Japanese Proverb" },
  { q: "Better than a thousand days of diligent study is one day with a great teacher.", a: "Japanese Proverb" },
  { q: "No matter how far you've gone on the wrong road, turn back.", a: "Japanese Proverb" },
  { q: "The secret of success is to get up one more time than you fall.", a: "Japanese Proverb" },
  { q: "Fall down seven times, get up eight.", a: "Japanese Proverb" },
  { q: "When the student is ready, the teacher will appear.", a: "Japanese Proverb" },

  // ——————————— STOIC PHILOSOPHY ———————————
  { q: "The happiness of your life depends upon the quality of your thoughts.", a: "Marcus Aurelius" },
  { q: "You have power over your mind — not outside events. Realize this, and you will find strength.", a: "Marcus Aurelius" },
  { q: "The soul becomes dyed with the color of its thoughts.", a: "Marcus Aurelius" },
  { q: "It's not what happens to you, but how you react to it that matters.", a: "Epictetus" },
  { q: "We suffer more in imagination than in reality.", a: "Seneca" },
  { q: "Luck is what happens when preparation meets opportunity.", a: "Seneca" },
  { q: "The greatest wealth is to live content with little.", a: "Plato" },
  { q: "Waste no more time arguing about what a good man should be. Be one.", a: "Marcus Aurelius" },
  { q: "The impediment to action advances action. What stands in the way becomes the way.", a: "Marcus Aurelius" },
  { q: "If it is not right, do not do it. If it is not true, do not say it.", a: "Marcus Aurelius" },

  // ——————————— COURAGE & RISK ———————————
  { q: "Courage is not the absence of fear, but the triumph over it.", a: "Nelson Mandela" },
  { q: "Courage is what it takes to stand up and speak; courage is also what it takes to sit down and listen.", a: "Winston Churchill" },
  { q: "He who is not courageous enough to take risks will accomplish nothing in life.", a: "Muhammad Ali" },
  { q: "Success is walking from failure to failure with no loss of enthusiasm.", a: "Winston Churchill" },
  { q: "The greatest glory in living lies not in never falling, but in rising every time we fall.", a: "Nelson Mandela" },
  { q: "Do not pray for an easy life. Pray for the strength to endure a difficult one.", a: "Bruce Lee" },
  { q: "If you want something you've never had, you must be willing to do something you've never done.", a: "Unknown" },
  { q: "Go confidently in the direction of your dreams. Live the life you have imagined.", a: "Henry David Thoreau" },

  // ——————————— EDUCATION & LEARNING ———————————
  { q: "Education is the most powerful weapon which you can use to change the world.", a: "Nelson Mandela" },
  { q: "Intelligence plus character — that is the goal of true education.", a: "Martin Luther King Jr." },
  { q: "The beautiful thing about learning is that nobody can take it away from you.", a: "B.B. King" },
  { q: "Live as if you were to die tomorrow. Learn as if you were to live forever.", a: "Mahatma Gandhi" },
  { q: "I have never let my schooling interfere with my education.", a: "Mark Twain" },
  { q: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", a: "Benjamin Franklin" },
  { q: "An investment in knowledge pays the best interest.", a: "Benjamin Franklin" },
  { q: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", a: "Dr. Seuss" },

  // ——————————— RESILIENCE & STRENGTH ———————————
  { q: "What doesn't kill us makes us stronger.", a: "Friedrich Nietzsche" },
  { q: "Rock bottom became the solid foundation on which I rebuilt my life.", a: "J.K. Rowling" },
  { q: "The oak fought the wind and was broken, the willow bent when it must and survived.", a: "Robert Jordan" },
  { q: "Life is not about how hard you hit. It's about how hard you can get hit and keep moving forward.", a: "Rocky Balboa" },
  { q: "Tough times never last, but tough people do.", a: "Robert H. Schuller" },
  { q: "When the world says give up, hope whispers try one more time.", a: "Unknown" },
  { q: "Stars can't shine without darkness.", a: "Unknown" },
  { q: "A smooth sea never made a skilled sailor.", a: "Franklin D. Roosevelt" },

  // ——————————— LEADERSHIP ———————————
  { q: "A leader is one who knows the way, goes the way, and shows the way.", a: "John C. Maxwell" },
  { q: "The greatest leader is not necessarily the one who does the greatest things. He is the one that gets the people to do the greatest things.", a: "Ronald Reagan" },
  { q: "The function of leadership is to produce more leaders, not more followers.", a: "Ralph Nader" },
  { q: "Nearly all men can stand adversity, but if you want to test a man's character, give him power.", a: "Abraham Lincoln" },
  { q: "A leader is best when people barely know he exists. When his work is done, they say: we did it ourselves.", a: "Lao Tzu" },
  { q: "Before you are a leader, success is all about growing yourself. When you become a leader, success is all about growing others.", a: "Jack Welch" },
  { q: "Leadership is not about being in charge. It's about taking care of those in your charge.", a: "Simon Sinek" },
  { q: "The best way to lead is by example.", a: "Unknown" },

  // ——————————— PAKISTANI & SOUTH ASIAN ———————————
  { q: "Rise above sectional interests and private ambitions. Pass from matter to spirit.", a: "Muhammad Ali Jinnah" },
  { q: "Think a hundred times before you take a decision, but once that decision is taken, stand by it as one man.", a: "Muhammad Ali Jinnah" },
  { q: "With faith, discipline, and selfless devotion to duty, there is nothing worthwhile that you cannot achieve.", a: "Muhammad Ali Jinnah" },
  { q: "The only thing I care about is that the people of Pakistan want me to serve them. I will serve them.", a: "Benazir Bhutto" },
  { q: "Democracy is necessary for peace and for progress.", a: "Benazir Bhutto" },
  { q: "The world is not a stage for the fulfillment of our desires. It is a field for our work.", a: "Allama Iqbal" },
  { q: "Nations are born in the hearts of poets.", a: "Allama Iqbal" },
  { q: "Khudi ko kar buland itna ke har taqdeer se pehle, khuda bande se khud pooche, bata teri raza kya hai.", a: "Allama Iqbal" },
  { q: "Raise yourself to such heights that before every destiny, God Himself asks you: tell me, what is your will?", a: "Allama Iqbal" },
  { q: "People who have no hold over their own selves are like drifting dust.", a: "Allama Iqbal" },
  { q: "Words without power are mere philosophy.", a: "Allama Iqbal" },
  { q: "No one has ever become poor by giving.", a: "Abdul Sattar Edhi" },
  { q: "If you want to eliminate hunger, everybody has to be given an equal chance.", a: "Abdul Sattar Edhi" },
  { q: "I'm not a leader. I'm just a man who did what he felt was right.", a: "Abdul Sattar Edhi" },
  { q: "My religion is service to humanity.", a: "Abdul Sattar Edhi" },
  { q: "A beautiful thing is never perfect.", a: "Nusrat Fateh Ali Khan" },
  { q: "One child, one teacher, one book, one pen — can change the world.", a: "Malala Yousafzai" },
  { q: "Let us make our future now, and let us make our dreams tomorrow's reality.", a: "Malala Yousafzai" },

  // ——————————— SHORT & POWERFUL ———————————
  { q: "Just do it.", a: "Unknown" },
  { q: "Keep going.", a: "Unknown" },
  { q: "Never give up.", a: "Unknown" },
  { q: "Stay hungry. Stay foolish.", a: "Steve Jobs" },
  { q: "Carpe diem.", a: "Horace" },
  { q: "Memento mori.", a: "Stoic Proverb" },
  { q: "This too shall pass.", a: "Persian Proverb" },
  { q: "Be the change.", a: "Mahatma Gandhi" },
  { q: "Keep it simple.", a: "Unknown" },
  { q: "Breathe.", a: "Unknown" },
  { q: "You got this.", a: "Unknown" },
  { q: "One day at a time.", a: "Unknown" },
  { q: "Focus.", a: "Unknown" },
  { q: "Hustle in silence.", a: "Unknown" },
  { q: "Let it go.", a: "Unknown" },

  // ——————————— DIVERSITY & INCLUSION ———————————
  { q: "We may have different religions, different languages, different colored skin, but we all belong to one human race.", a: "Kofi Annan" },
  { q: "Diversity is being invited to the party; inclusion is being asked to dance.", a: "Verna Myers" },
  { q: "Our ability to reach unity in diversity will be the beauty and the test of our civilization.", a: "Mahatma Gandhi" },
  { q: "It is time for parents to teach young people early on that in diversity there is beauty and there is strength.", a: "Maya Angelou" },
  { q: "No culture can live if it attempts to be exclusive.", a: "Mahatma Gandhi" },

  // ——————————— HUMOR & LIGHTNESS ———————————
  { q: "The secret of life is honesty and fair dealing. If you can fake that, you've got it made.", a: "Groucho Marx" },
  { q: "I'm not afraid of death; I just don't want to be there when it happens.", a: "Woody Allen" },
  { q: "The best way to cheer yourself is to try to cheer someone else up.", a: "Mark Twain" },
  { q: "A day without laughter is a day wasted.", a: "Charlie Chaplin" },
  { q: "Age is an issue of mind over matter. If you don't mind, it doesn't matter.", a: "Mark Twain" },
  { q: "The only thing necessary for the triumph of evil is for good men to do nothing.", a: "Edmund Burke" },
  { q: "Not all those who wander are lost.", a: "J.R.R. Tolkien" },
  { q: "I have a dream that my four little children will one day live in a nation where they will not be judged by the color of their skin but by the content of their character.", a: "Martin Luther King Jr." },

  // ——————————— NATURE & PEACE ———————————
  { q: "In every walk with nature one receives far more than he seeks.", a: "John Muir" },
  { q: "Look deep into nature, and then you will understand everything better.", a: "Albert Einstein" },
  { q: "The clearest way into the Universe is through a forest wilderness.", a: "John Muir" },
  { q: "Nature does not hurry, yet everything is accomplished.", a: "Lao Tzu" },
  { q: "Adopt the pace of nature: her secret is patience.", a: "Ralph Waldo Emerson" },
  { q: "The mountains are calling and I must go.", a: "John Muir" },
  { q: "The earth has music for those who listen.", a: "Shakespeare" },
  { q: "Sit in reverie and watch the changing color of the waves that fall upon the idle seashore.", a: "Henry Wadsworth Longfellow" },
  { q: "I felt my lungs inflate with the onrush of scenery—air, mountains, trees, people.", a: "Jack Kerouac" },

  // ——————————— MODERN WISDOM ———————————
  { q: "If you talk to a man in a language he understands, that goes to his head. If you talk to him in his language, that goes to his heart.", a: "Nelson Mandela" },
  { q: "The world is a book, and those who do not travel read only a page.", a: "Saint Augustine" },
  { q: "So many books, so little time.", a: "Frank Zappa" },
  { q: "Life is like a bicycle. To keep your balance you must keep moving.", a: "Albert Einstein" },
  { q: "The only true wisdom is in knowing you know nothing.", a: "Socrates" },
  { q: "The measure of intelligence is the ability to change.", a: "Albert Einstein" },
  { q: "Small minds discuss persons. Average minds discuss events. Great minds discuss ideas.", a: "Eleanor Roosevelt" },
  { q: "Difficult roads often lead to beautiful destinations.", a: "Unknown" },
  { q: "If the plan doesn't work, change the plan but never the goal.", a: "Unknown" },

  // ——————————— FEMININE WISDOM ———————————
  { q: "I raise up my voice — not so I can shout, but so that those without a voice can be heard.", a: "Malala Yousafzai" },
  { q: "Feminism isn't about making women strong. Women are already strong. It's about changing the way the world perceives that strength.", a: "G.D. Anderson" },
  { q: "We need to reshape our own perception of how we view ourselves. We have to step up as women and take the lead.", a: "Beyoncé" },
  { q: "The most courageous act is still to think for yourself. Aloud.", a: "Coco Chanel" },
  { q: "There is no limit to what we, as women, can accomplish.", a: "Michelle Obama" },
  { q: "I do not wish women to have power over men; but over themselves.", a: "Mary Shelley" },
  { q: "The question isn't who's going to let me. It's who's going to stop me.", a: "Ayn Rand" },
  { q: "A woman with a voice is, by definition, a strong woman.", a: "Melinda Gates" },
  { q: "Each time a woman stands up for herself, without knowing it possibly, she stands up for all women.", a: "Maya Angelou" },

  // ——————————— PAKISTAN MOVEMENT ———————————
  { q: "There is no power on earth that can undo Pakistan.", a: "Muhammad Ali Jinnah" },
  { q: "With faith, discipline and selfless devotion to duty, there is nothing worthwhile that you cannot achieve.", a: "Muhammad Ali Jinnah" },
  { q: "Failure is a word unknown to me.", a: "Muhammad Ali Jinnah" },

  // ——————————— ADDITIONAL BANGLADESHI ———————————
  { q: "Bangladesh was born from the blood of martyrs. Its future is nurtured by the sweat of its people.", a: "Zahir Raihan" },
  { q: "We gave blood, but we gave it for freedom. That is the most precious thing anyone can give.", a: "Sheikh Mujibur Rahman" },
  { q: "The battle of life is, in all ages, hard. But for the Bengali, it became harder because we had to fight for our language first.", a: "Shahidullah Kaiser" },
  { q: "Language is the soul of a nation. To kill a language is to kill a people.", a: "Abdul Jabbar (Language Martyr)" },
  { q: "The red sun of independence that rose in 1971 will never set.", a: "Ziaur Rahman" },
  { q: "My language is my identity. Without it, I am nobody.", a: "Rafiq Uddin Ahmed" },
  { q: "Art is not a luxury. It is the soul of a nation.", a: "Zainul Abedin" },
  { q: "The village is the heart of Bengal. No matter where we go, we carry its soil in our hearts.", a: "Jasimuddin" },
  { q: "We who live by the river know that nothing is permanent. Not joy, not sorrow. Only the flow.", a: "Humayun Ahmed" },
  { q: "A mother's love is like the Jamuna — endless, deep, and always flowing.", a: "Shamsur Rahman" },
  { q: "Books are my windows to a world larger than this country. Through them, I am free.", a: "Akhtaruzzaman Elias" },
  { q: "The rivers of Bengal have taught me that no obstacle is permanent. Water always finds its way.", a: "Al Mahmud" },
  { q: "Bangladeshi soil produced the Nobel Prize in Physics. What excuse do we have for not dreaming big?", a: "Abdus Salam" },
  { q: "A farmer in Bangladesh works harder than anyone on earth. I dedicate my life to them.", a: "Abdul Hamid Khan Bhashani" },

  // ——————————— TECHNOLOGY & INNOVATION ———————————
  { q: "Innovation distinguishes between a leader and a follower.", a: "Steve Jobs" },
  { q: "The people who are crazy enough to think they can change the world are the ones who do.", a: "Steve Jobs" },
  { q: "Design is not just what it looks like and feels like. Design is how it works.", a: "Steve Jobs" },
  { q: "Your most unhappy customers are your greatest source of learning.", a: "Bill Gates" },
  { q: "The best way to predict the future is to invent it.", a: "Alan Kay" },
  { q: "Our whole life is solving puzzles.", a: "Elon Musk" },
  { q: "When something is important enough, you do it even if the odds are not in your favor.", a: "Elon Musk" },
  { q: "The future of humanity is going to be decided by what we do with technology.", a: "Mustafa Suleyman" },
  { q: "Software is eating the world.", a: "Marc Andreessen" },
  { q: "Data is the new oil.", a: "Clive Humby" },
  { q: "The single biggest threat to humanity is the mismatch between our technology and our wisdom.", a: "Yuval Noah Harari" },

  // ——————————— BENGALI LANGUAGE MOVEMENT ———————————
  { q: "The language movement of 1952 was not just about language. It was about the right to exist.", a: "Bangladeshi Historian" },
  { q: "Ekushey is not just a day. It is the soul of a nation that refused to die.", a: "Bengali Proverb" },
  { q: "Amar bhai-er rakte rangano Ekushey February — ami ki bhulite pari?", a: "Abdul Gaffar Choudhury" },
  { q: "Language is the roadmap of a culture. It tells you where its people come from and where they are going.", a: "Rita Mae Brown" },
  { q: "The Bengali language is the most powerful statement of our identity as a people.", a: "Bangladeshi Proverb" },
  { q: "The blood of February 1952 waters the fields of Bengali pride every generation.", a: "Bangladeshi Proverb" },
  { q: "Every Bengali child learns the value of sacrifice from the language martyrs.", a: "Bangladeshi Proverb" },
  { q: "Vaasha-i manush, vaasha-i jaati. Language makes us human, language makes us a nation.", a: "Bangladeshi Proverb" },
];

const CATEGORIES = [
  'All', 'Motivation', 'Wisdom', 'Bengali', 'Indian', 'Persian/Sufi',
  'Islamic', 'Japanese', 'Stoic', 'African', 'Resilience',
  'Love', 'Creativity', 'Leadership', 'Technology', 'Nature', 'Life'
];

function categorizeQuote(q) {
  const text = q.q.toLowerCase() + ' ' + q.a.toLowerCase();
  const author = q.a.toLowerCase();
  if (['bangladeshi proverb', 'bengali wisdom', 'kazim nazrul', 'rabindranath', 'begum rokeya', 'sheikh mujibur', 'zahir raihan', 'shahidullah', 'abdul jabbar', 'ziaur rahman', 'rafiq', 'shamsur', 'humayun', 'akhtaruzzaman', 'abdus salam', 'abdul hamid', 'jasimuddin', 'nazrul', 'al mahmud'].some(s => text.includes(s))) return 'Bengali';
  if (['rumi', 'rumi', 'omar khayyam', 'persian'].some(s => text.includes(s))) return 'Persian/Sufi';
  if (['prophet muhammad', 'quran', 'islamic', 'muslim'].some(s => text.includes(s))) return 'Islamic';
  if (['japanese proverb'].some(s => text.includes(s))) return 'Japanese';
  if (['marcus aurelius', 'epictetus', 'seneca', 'stoic'].some(s => text.includes(s))) return 'Stoic';
  if (['african proverb'].some(s => text.includes(s))) return 'African';
  if (['gandhi', 'swami', 'bhagavad', 'tagore', 'kalam', 'ambani', 'nazrul', 'begum rokeya', 'indian '].some(s => text.includes(s) || author.includes(s))) return 'Indian';
  if (['love', 'compassion', 'kindness', 'heart'].some(s => text.includes(s))) return 'Love';
  if (['creativity', 'imagination', 'artist', 'art ', 'music', 'poet'].some(s => text.includes(s))) return 'Creativity';
  if (['leader', 'leadership'].some(s => text.includes(s))) return 'Leadership';
  if (['technology', 'software', 'innovation', 'steve jobs', 'elon', 'bill gates', 'data'].some(s => text.includes(s))) return 'Technology';
  if (['nature', 'mountain', 'forest', 'river', 'earth', 'tree'].some(s => text.includes(s))) return 'Nature';
  if (['happiness', 'life', 'live', 'die', 'death'].some(s => text.includes(s))) return 'Life';
  if (['resilience', 'strength', 'courage', 'tough', 'fall', 'rise', 'never give'].some(s => text.includes(s))) return 'Resilience';
  if (['success', 'motivation', 'dream', 'goal', 'achieve', 'inspire'].some(s => text.includes(s))) return 'Motivation';
  return 'Wisdom';
}

const QUOTES_WITH_CATEGORIES = QUOTES.map((q, i) => ({
  ...q, id: i, category: categorizeQuote(q),
}));

const QUOTE_OF_THE_DAY = QUOTES_WITH_CATEGORIES.length > 0
  ? QUOTES_WITH_CATEGORIES[Math.floor(Math.abs(14 * 365 + new Date().getDate() + new Date().getMonth() * 31) % QUOTES_WITH_CATEGORIES.length)]
  : { id: 0, q: 'The only way to do great work is to love what you do.', a: 'Steve Jobs', category: 'Motivation' };

const FAVORITES_KEY = 'zen_quote_favorites';

export default function ZenQuotes() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [dailyQuote, setDailyQuote] = useState(QUOTE_OF_THE_DAY);

  useEffect(() => { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)); }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const copyQuote = (q, a) => {
    navigator.clipboard.writeText(`"${q}" — ${a}`)
      .then(() => { setCopiedId(q); setTimeout(() => setCopiedId(null), 2000); });
  };

  const refreshDaily = () => {
    const random = QUOTES_WITH_CATEGORIES[Math.floor(Math.random() * QUOTES_WITH_CATEGORIES.length)];
    setDailyQuote(random);
  };

  const filteredQuotes = useMemo(() => {
    let list = showFavorites
      ? QUOTES_WITH_CATEGORIES.filter(q => favorites.includes(q.id))
      : QUOTES_WITH_CATEGORIES;
    if (categoryFilter !== 'All') {
      list = list.filter(q => q.category === categoryFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(quote =>
        quote.q.toLowerCase().includes(q) || quote.a.toLowerCase().includes(q)
      );
    }
    return list;
  }, [categoryFilter, searchQuery, showFavorites, favorites]);

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* ═══ Quote of the Day ═══ */}
      <div className="zen-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
          <Quote className="w-full h-full" />
        </div>
        <div className="p-5 md:p-6 relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">Quote of the Day</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--color-zen-border-light)] dark:bg-[var(--color-zen-border-dark)] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">{dailyQuote.category}</span>
          </div>
          <div className="min-h-[80px]">
            <p className="text-base md:text-lg leading-relaxed text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] font-medium italic">
              &ldquo;{dailyQuote.q}&rdquo;
            </p>
            <p className="mt-3 text-xs font-semibold text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]">
              — {dailyQuote.a}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)]">
            <button onClick={() => copyQuote(dailyQuote.q, dailyQuote.a)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)] transition-all">
              {copiedId === dailyQuote.q ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              {copiedId === dailyQuote.q ? 'Copied!' : 'Copy'}
            </button>
            <button onClick={() => toggleFavorite(dailyQuote.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs border transition-all ${favorites.includes(dailyQuote.id) ? 'border-pink-300 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400' : 'border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)]'}`}>
              <Heart className={`w-3 h-3 ${favorites.includes(dailyQuote.id) ? 'fill-pink-500 text-pink-500' : ''}`} />
              {favorites.includes(dailyQuote.id) ? 'Saved' : 'Save'}
            </button>
            <button onClick={refreshDaily}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)] transition-all ml-auto">
              <RefreshCw className="w-3 h-3" /> New Quote
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Controls ═══ */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
          {showFavorites ? `Favorites (${favorites.length})` : `All Quotes (${QUOTES_WITH_CATEGORIES.length})`}
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFavorites(!showFavorites)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-all ${showFavorites
              ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800'
              : 'zen-btn-secondary border'}`}>
            <Heart className={`w-3.5 h-3.5 ${showFavorites ? 'fill-pink-500' : ''}`} />
            Favorites
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5">
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.slice(0, 6).map(cat => (
            <button key={cat} onClick={() => { setCategoryFilter(cat); setShowFavorites(false); }}
              className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${categoryFilter === cat
                ? 'bg-[var(--color-zen-accent-primary-light)] dark:bg-[var(--color-zen-accent-primary-dark)] text-white'
                : 'bg-[var(--color-zen-border-light)] dark:bg-[var(--color-zen-border-dark)] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:opacity-80'}`}>
              {cat}
            </button>
          ))}
          <select value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setShowFavorites(false); }}
            className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-[var(--color-zen-border-light)] dark:bg-[var(--color-zen-border-dark)] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] border-0 focus:ring-0 outline-none">
            {CATEGORIES.slice(6).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-3.5 h-3.5 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]" />
        </div>
        <input type="text" placeholder="Search quotes or authors..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="zen-input w-full pl-9 pr-8 text-xs py-2" />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:text-[var(--color-zen-text-light)] dark:hover:text-[var(--color-zen-text-dark)]">
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Quote Grid */}
      <div className="grid md:grid-cols-2 gap-3">
        {filteredQuotes.map(quote => {
          const isFav = favorites.includes(quote.id);
          const isCopied = copiedId === quote.q;
          return (
            <div key={quote.id} className="zen-card p-4 hover:shadow-md transition-all group relative">
              <p className="text-xs leading-relaxed text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] mb-2 pr-6">
                &ldquo;{quote.q}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-semibold text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)] truncate">
                    — {quote.a}
                  </span>
                  <span className="text-[9px] px-1 py-0.5 rounded bg-[var(--color-zen-border-light)] dark:bg-[var(--color-zen-border-dark)] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] shrink-0">
                    {quote.category}
                  </span>
                </div>
              </div>
              {/* Hover actions */}
              <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => copyQuote(quote.q, quote.a)}
                  className="p-1 rounded text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)] transition-all">
                  {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
                <button onClick={() => toggleFavorite(quote.id)}
                  className={`p-1 rounded transition-all ${isFav ? 'text-pink-500' : 'text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)]'}`}>
                  <Heart className={`w-3 h-3 ${isFav ? 'fill-pink-500' : ''}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredQuotes.length === 0 && (
        <div className="text-center py-12">
          <Quote className="w-8 h-8 mx-auto mb-3 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] opacity-40" />
          <p className="text-sm text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
            {showFavorites ? 'No saved favorites yet. Click the heart icon to save quotes.' : 'No quotes match your search.'}
          </p>
        </div>
      )}

      <div className="text-center text-[10px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
        {QUOTES_WITH_CATEGORIES.length} quotes across {CATEGORIES.length - 1} categories &middot; {favorites.length} saved
      </div>
    </div>
  );
}
