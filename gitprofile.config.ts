// gitprofile.config.ts

const CONFIG = {
  github: {
    username: 'nmamie', // Your GitHub org/user name. (This is the only required config)
  },
  /**
   * If you are deploying to https://<USERNAME>.github.io/, for example your repository is at https://github.com/arifszn/arifszn.github.io, set base to '/'.
   * If you are deploying to https://<USERNAME>.github.io/<REPO_NAME>/,
   * for example your repository is at https://github.com/arifszn/portfolio, then set base to '/portfolio/'.
   */
  base: '/',
  projects: {
    github: {
      display: true, // Display GitHub projects?
      header: 'Github Projects',
      mode: 'automatic', // Mode can be: 'automatic' or 'manual'
      automatic: {
        sortBy: 'stars', // Sort projects by 'stars' or 'updated'
        limit: 6, // How many projects to display.
        exclude: {
          forks: true, // Forked projects will not be displayed if set to true.
          projects: [], // These projects will not be displayed. example: ['arifszn/my-project1', 'arifszn/my-project2']
        },
      },
      manual: {
        // Properties for manually specifying projects
        projects: ['nmamie/HiveLLM', 'nmamie/RLatari'], // List of repository names to display. example: ['arifszn/my-project1', 'arifszn/my-project2']
      },
    },
    external: {
      header: 'Research Platforms & Systems',
      // To hide the `External Projects` section, keep it empty.
      projects: [
        {
          title: 'Informfully — Empirical Study Platform',
          link: 'http://informfully.ch/',
          description: 'An end-to-end research platform for conducting empirical field studies. Informfully comprises native mobile applications for iOS and Android delivering personalized text, audio, and video content with behavioral logging and in-app surveys to facilitate rigorous research on recommender systems.',
          imageUrl: '/informfully.png',
          platforms: ['iOS App', 'Android App', 'Web Dashboard'],
          tags: ['Empirical Field Studies', 'News Recommenders', 'Behavioral Logging', 'In-App Surveys'],
        },
        {
          title: 'The Society of HiveMind (HiveLLM)',
          link: 'https://github.com/nmamie/HiveLLM',
          description: 'An evolutionary multi-agent optimization framework orchestrating swarms of diverse foundation models (LLMs) to unlock collective reasoning and emergent intelligence, presented at the 16th International Conference on Swarm Intelligence (ICSI 2025).',
          imageUrl: '/img/HiveMind.png',
          platforms: ['Multi-Agent Swarms', 'Python Package', 'ICSI 2025'],
          tags: ['Swarm Intelligence', 'Multi-Agent LLMs', 'Evolutionary Optimization', 'Collective AI'],
        },
        {
          title: 'Voting Booklet Bias Monitor',
          link: 'https://github.com/ZurichNLP/voting-booklet-bias',
          description: 'Multilingual stance detection system analyzing official federal voting booklets across German, French, and Italian with fine-tuned M-BERT models to empirically monitor neutrality in Swiss direct democracy. Awarded the SwissText 2023 Best Poster Award 🏆.',
          imageUrl: '/img/dist_all.png',
          platforms: ['NLP Pipeline', 'M-BERT', 'SwissText Best Poster 🏆'],
          tags: ['Stance Detection', 'Direct Democracy', 'Multilingual NLP', 'Bias Monitoring'],
        },
        {
          title: 'Deep Reinforcement Learning (RLatari)',
          link: 'https://github.com/nmamie/RLatari',
          description: 'High-performance reinforcement learning implementations experimenting with deep Q-networks, policy optimization, and representation learning across classic Atari 2600 benchmark environments.',
          imageUrl: '/img/atari.png',
          platforms: ['PyTorch', 'Arcade Gym', 'Discrete Control'],
          tags: ['Reinforcement Learning', 'Deep Q-Networks', 'Policy Gradients', 'Atari Gym'],
        },
      ],
    },
  },
  seo: { 
    title: 'Noah Mamié | PhD Researcher & UZH.ai Fellow', 
    description: 'Doctoral Researcher & UZH.ai Fellow @ University of Zurich (DDIS Lab) | DSI Excellence Program | GenAI for Personalized News Recommender Systems, Swarm & Collective Intelligence, Graph Neural Networks', 
    imageURL: '/logo.png' 
  },
  social: {
    linkedin: 'noah-mamie',
    x: '',
    mastodon: '',
    researchGate: '',
    facebook: '',
    instagram: '',
    reddit: '',
    threads: '',
    youtube: '', // example: 'pewdiepie'
    udemy: '',
    dribbble: '',
    behance: '',
    medium: 'nmamie',
    dev: '',
    stackoverflow: '', // example: '1/jeff-atwood'
    discord: '',
    telegram: '',
    scholar: 'https://scholar.google.com/citations?user=JhXjm_sAAAAJ&hl=de',
    scholarName: 'Noah Mamié',
    phone: '',
    email: 'noah@mamié.ch',
    bluesky: 'nmamie.bsky.social',
    substack: 'noahmamie',
    lesswrong: 'nmamie',
  },
  resume: {
    fileUrl:
      'CV_Noah.pdf', // Empty fileUrl will hide the `Download Resume` button.
  },
  researchInterests: [
    'Multi-Agent Systems',
    'Swarm Intelligence',
    'Generative AI',
    'Recommender Systems',
    'Graph Neural Networks',
  ],
  enableSwarmDemo: true,
  skills: [
    'Python',
    'PyTorch',
    'C/C++',
    'Java',
    'JavaScript',
    'React.js',
    'Node.js',
    'Next.js',
    'MySQL',
    'PostgreSQL',
    'Git',
    'Docker',
    'CSS',
  ],
  experiences: [
    {
      company: 'University of Zurich',
      position: 'Doctoral Researcher & UZH.ai Fellow (DSI Excellence Program)',
      from: 'September 2025',
      to: 'Present',
      companyLink: 'https://www.ifi.uzh.ch',
    },
    {
      company: 'Detecon Switzerland',
      position: 'Generative AI Intern',
      from: 'April 2025',
      to: 'August 2025',
      companyLink: 'https://www.detecon.com',
    },
    {
      company: 'ETH Zurich (Chair of Applied Economics)',
      position: 'Research Assistant',
      from: '2023',
      to: '2025',
      companyLink: 'https://mtec.ethz.ch',
    },
    {
      company: 'Storskogen Switzerland AG',
      position: 'Private Equity Intelligence DACH',
      from: '2021',
      to: '2022',
    },
    {
      company: 'Artum AG (Storskogen CH)',
      position: 'Private Equity Intern',
      from: '2021',
      to: '2021',
    },
    {
      company: 'Ernst & Young',
      position: 'Assurance Industrial Services Intern',
      from: '2020',
      to: '2020',
    },
    {
      company: 'Dr. Wolff Singapore Pte. Ltd.',
      position: 'Student Consultant',
      from: '2019',
      to: '2019',
    },
    {
      company: 'SpanSet Spain',
      position: 'Accounting, Marketing & Sales Intern',
      from: '2016',
      to: '2016',
    },
  ],
  certifications: [
    {
      name: 'Bloomberg Market Concepts',
      body: 'Bloomberg',
      year: 'Jan 2021',
      link: 'Credential ID 160629711743',
    },
    {
      name: 'Harvard CS50',
      body: 'CS50x: Introduction to the Intellectual Enterprises of Computer Science and the Art of Programming',
      year: 'Dec 2020',
      link: 'https://certificates.cs50.io/d585320d-bb6f-48e6-86f6-93ac9602c8d2.pdf?size=letter',
    },
  ],
  educations: [
    {
      institution: 'University of Zurich',
      degree: 'PhD in Artificial Intelligence',
      from: '2025',
      to: 'Present',
    },
    {
      institution: 'University of Zurich',
      degree: 'MSc in Artificial Intelligence',
      from: '2022',
      to: '2024',
    },
    {
      institution: 'University of St. Gallen',
      degree: 'BA in Business Administration',
      from: '2017',
      to: '2021',
    },
  ],
  teaching: [
    {
      course: 'Informatics and the Economy (Informatik und Wirtschaft)',
      role: 'Head TA & Co-Organizer (Prof. Bernstein)',
      institution: 'University of Zurich',
      year: '2026 - Present',
      link: 'https://studentservices.uzh.ch/uzh/anonym/vvz/?sap-language=DE&sap-ui-language=DE#/details/2026/003/SM/51110635',
    },
    {
      course: 'Essentials of Text and Speech Processing',
      role: 'Teaching Assistant (Dr. Mathias Müller)',
      institution: 'University of Zurich (Computational Linguistics)',
      year: '2023',
    },
    {
      course: 'Operations Management (Excel, Operations)',
      role: 'Teaching Assistant (Prof. Dr. Wortmann)',
      institution: 'University of St. Gallen (ITEM-HSG)',
      year: '2020',
    },
    {
      course: 'Programming (Python, R, HTML/CSS/JS)',
      role: 'Teaching Assistant (Dr. Silic)',
      institution: 'University of St. Gallen (IWI-HSG)',
      year: '2019',
    },
  ],
  publications: [
    {
      title: 'The Society of HiveMind: Multi-Agent Optimization of Foundation Model Swarms to Unlock the Potential of Collective Intelligence',
      conferenceName: 'The Sixteenth International Conference on Swarm Intelligence 2025',
      journalName: '',
      authors: 'Noah Mamié and Susie Xi Rao',
      link: 'https://link.springer.com/chapter/10.1007/978-981-95-0982-9_20',
      googleScholarLink: 'https://scholar.google.com/citations?view_op=view_citation&hl=de&user=JhXjm_sAAAAJ&citation_for_view=JhXjm_sAAAAJ:qjMakFHDy7sC',
      citations: 11,
      selected: true,
      tldr: 'Foundation model swarms mimicking biological flocking behaviors significantly outperform individual LLMs in complex logical reasoning.',
      topics: ['Swarm Intelligence', 'Multi-Agent Systems'],
      codeUrl: 'https://github.com/nmamie/HiveLLM',
      description:
        'Multi-agent systems address issues of accessibility and scalability of artificial intelligence (AI) foundation models, which are often represented by large language models. We develop a framework - the “Society of HiveMind” (SOHM) - that orchestrates the interaction between multiple AI foundation models, imitating the observed behavior of animal swarms in nature by following modern evolutionary theories. On the one hand, we find that the SOHM provides a negligible benefit on tasks that mainly require real-world knowledge. On the one hand, we remark a significant improvement on tasks that require intensive logical reasoning, indicating that multi-agent systems are capable of increasing the reasoning capabilities of the collective compared to the individual agents. Our findings demonstrate the potential of combining a multitude of diverse AI foundation models to form an artificial swarm intelligence capable of self-improvement through interactions with a given environment.',
      year: '2025',
      imageUrl: '/img/HiveMind.png',
      bibtex: `@inproceedings{10.1007/978-981-95-0982-9_20,
  author = {Mami{\'e}, Noah and Rao, Susie Xi},
  editor = {Tan, Ying and Shi, Yuhui},
  title = {The Society of HiveMind: Multi-Agent Optimization of Foundation Model Swarms to Unlock the Potential of Collective Intelligence},
  booktitle = {Advances in Swarm Intelligence},
  year = {2025},
  publisher = {Springer Nature Singapore},
  address = {Singapore},
  pages = {243--254},
  isbn = {978-981-95-0982-9}
}`,
      laymanSummary: 'We designed "Society of HiveMind," a system that links multiple AI models together like a swarm of bees or a flock of birds. We discovered that by working together and exchanging feedback, the team of AIs could solve complex logical reasoning problems much better than any single AI could alone.',
      authorLinks: {
        'Susie Xi Rao': 'https://susierao.github.io/',
      },
    },
    {
      title: 'Voting Booklet Bias: Stance Detection in Swiss Federal Communication',
      conferenceName: 'SwissText Analytics Conference 2023',
      journalName: '',
      authors: 'Eric Egli, Noah Mamié, Mathias Müller and Eyal Liron Dolev',
      link: 'https://arxiv.org/pdf/2306.08999',
      googleScholarLink: 'https://scholar.google.com/citations?view_op=view_citation&hl=de&user=JhXjm_sAAAAJ&citation_for_view=JhXjm_sAAAAJ:u5HHmVD_uO8C',
      citations: 3,
      selected: true,
      tldr: 'Automated stance detection across Swiss official voting booklets reveals subtle linguistic slant across German, French, and Italian.',
      topics: ['NLP & Bias Detection', 'Political AI'],
      codeUrl: 'https://github.com/ZurichNLP/voting-booklet-bias',
      description:
        'In this study, we use recent stance detection methods to study the stance (for, against or neutral) of statements in official information booklets for voters. Our main goal is to answer the fundamental question: are topics to be voted on presented in a neutral way? To this end, we first train and compare several models for stance detection on a large dataset about Swiss politics. We find that fine-tuning an M-BERT model leads to the best accuracy. We then use our best model to analyze the stance of utterances extracted from the Swiss federal voting booklet concerning the Swiss popular votes of September 2022, which is the main goal of this project. We evaluated the models in both a multilingual as well as a monolingual context for German, French, and Italian. Our analysis shows that some issues are heavily favored while others are more balanced, and that the results are largely consistent across languages. Our findings have implications for the editorial process of future voting booklets and the design of better automated systems for analyzing political discourse. The data and code accompanying this paper are available at https://github.com/ZurichNLP/voting-booklet-bias.',
      year: '2023',
      imageUrl: '/img/dist_all.png',
      bibtex: `@inproceedings{egli2023voting,
  title={{Voting Booklet Bias: Stance Detection in Swiss Federal Communication}},
  author={Egli, Eric and Mami{\'e}, Noah and Dolev, Eyal Liron and M{\"u}ller, Mathias},
  booktitle={Proceedings of the 8th edition of the Swiss Text Analytics Conference},
  pages={},
  note={received best poster award},
  year={2023},
  organization={ACL Anthology},
  url={https://arxiv.org/pdf/2306.08999}
}`,
      laymanSummary: 'We used AI models to analyze official Swiss voting information booklets. Our model automatically classified statements as being "for", "against", or "neutral" towards a vote. We discovered that some topics were presented with a clear bias, showing that automated tools can help monitor neutrality in political discourse.',
      authorLinks: {
        'Eric Egli': 'https://github.com/ericegli',
        'Mathias Müller': 'https://www.cl.uzh.ch/en/people/team/mueller.html',
        'Eyal Liron Dolev': 'https://github.com/eyaldolev',
      },
      journalAward: 'Best Poster Award 🏆',
    },
  ],
  news: [
    {
      title: 'Awarded UZH.ai Fellowship & Accepted into DSI Excellence Program 🎉',
      date: 'September 2026',
      link: 'https://www.ai.uzh.ch/en/research/UZH.ai-Fellowship-Program-2026.html',
      description: 'Honored to receive the prestigious UZH.ai Fellowship and be admitted into the Digital Society Initiative (DSI) Excellence Program at the University of Zurich starting September 1, 2026. Looking forward to deep interdisciplinary collaboration on AI and digital transformation!',
    },
    {
      title: 'Invited guest lecture on personalized recommender systems and the Informfully ecosystem in the "Recommender Systems" course at HSLU, Luzern',
      date: 'August 2026',
      link: 'https://www.hslu.ch/en/lucerne-school-of-business/degree-programmes/master/applied-information-and-data-science/',
      description: 'I was invited to give a guest lecture on personalized recommender systems and the Informfully ecosystem in the "Recommender Systems" master\'s level course at the School of Applied Sciences Luzern (HSLU).',
    }, 
    {
      title: 'Invited system demonstration of Informfully at the Recommenders in News Media NAMS 2026 Side event',
      date: 'May 2026',
      link: 'https://sites.google.com/view/recommenders-in-news-media/recommenders-in-news-media',
      description: 'We were invited to present our research platform Informfully at the Recommenders in News Media NAMS 2026 Side event, where I demonstrated the brand new interface and features of the platform and interacted with the community.',
    },
    {
      title: 'New paper published 🎉: The Society of HiveMind',
      date: 'October 2025',
      link: 'https://nmamie.medium.com/beyond-scaling-unlocking-collective-swarm-intelligence-with-the-society-of-hivemind-9683b75163fd',
      description: 'We presented our work at the 16th International Conference on Swarm Intelligence (ICSI 2025) in Yokohama, Japan, and are excited to share our findings with the community.',
    },
    {
      title: 'Starting PhD at University of Zurich!',
      date: 'September 2025',
      link: 'https://www.ifi.uzh.ch/en/ddis/people/nmamie.html',
      description: 'I am excited to start my PhD journey at the University of Zurich, focusing on the potential of GenAI in the Context of Personalized Recommender Systems.',
    },
    {
      title: 'New paper on arXiv: The Society of HiveMind',
      date: 'March 2025',
      link: 'https://arxiv.org/abs/2503.05473',
      description: 'Our latest research on foundation model swarms is now available on arXiv.',
    },
  ],
  talks: [
    {
      title: 'Personalized Recommender Systems & The Informfully Ecosystem',
      date: 'HSLU Luzern — August 2026',
      link: 'https://www.hslu.ch/en/lucerne-school-of-business/degree-programmes/master/applied-information-and-data-science/',
      description: 'Invited guest lecture in the "Recommender Systems" Master of Science course at Lucerne University of Applied Sciences and Arts (HSLU), covering personalized news delivery, behavioral logging, and empirical study design using Informfully.',
    },
    {
      title: 'Informfully System Demonstration at Recommenders in News Media (NAMS 2026)',
      date: 'Zurich — May 2026',
      link: 'https://sites.google.com/view/recommenders-in-news-media/recommenders-in-news-media',
      description: 'Demonstrated the Informfully mobile app and web orchestration dashboard at the NAMS 2026 workshop, detailing how empirical researchers run real-time personalized news studies with in-app behavioral tracking.',
    },
    {
      title: 'The Society of HiveMind: Multi-Agent Optimization of Foundation Model Swarms',
      date: 'ICSI 2025 • Yokohama, Japan — October 2025',
      link: 'https://link.springer.com/chapter/10.1007/978-981-95-0982-9_20',
      description: 'Oral conference presentation at the 16th International Conference on Swarm Intelligence (ICSI 2025), exploring how multi-agent foundation model swarms exhibit emergent collective reasoning and self-improvement.',
    },
  ],
  // Display articles from your medium or dev account. (Optional)
  blog: {
    source: 'medium', // medium | dev
    username: 'nmamie', // to hide blog section, keep it empty
    limit: 4, // How many articles to display. Max is 10.
  },
  googleAnalytics: {
    id: '', // GA3 tracking id/GA4 tag id UA-XXXXXXXXX-X | G-XXXXXXXXXX
  },
  // Track visitor interaction and behavior. https://www.hotjar.com
  hotjar: { id: '', snippetVersion: 6 },
  themeConfig: {
    defaultTheme: 'forest',

    // Hides the switch in the navbar
    // Useful if you want to support a single color mode
    disableSwitch: false,

    // Should use the prefers-color-scheme media-query,
    // using user system preferences, instead of the hardcoded defaultTheme
    respectPrefersColorScheme: false,

    // Display the ring in Profile picture
    displayAvatarRing: true,

    // Available themes. To remove any theme, exclude from here.
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      'dim',
      'nord',
      'sunset',
      'caramellatte',
      'abyss',
      'silk',
      'procyon',
    ],
  },

  // Optional Footer. Supports plain text or HTML.
  footer: `Made with ❤️ in Switzerland. © Copyright 2026 Noah Mamié.`,

  enablePWA: true,
};

export default CONFIG;
