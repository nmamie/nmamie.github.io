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
        limit: 4, // How many projects to display.
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
      header: 'My Research Projects',
      // To hide the `External Projects` section, keep it empty.
      projects: [
        {
          name: 'Informfully',
          link: 'http://informfully.ch/',
          description: 'Informfully is a research platform for conducting empirical field studies. At its core, Informfully is a smartphone application for Android and iOS to push text, audio, and video content to users. It allows researchers to log all activities of participants and offers in-app surveys to facilitate their user studies.',
          image: 'informfully.png',
        },
      ],
    },
  },
  seo: { title: 'Noah Mamié', description: 'PhD @ UZH | Artificial Intelligence | GenAI, Multi-Agent Systems, GNNs', imageURL: '/logo.png' },
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
  },
  resume: {
    fileUrl:
      'CV_Noah.pdf', // Empty fileUrl will hide the `Download Resume` button.
  },
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
      position: 'Doctoral Researcher',
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
  publications: [
    {
      title: 'The Society of HiveMind: Multi-Agent Optimization of Foundation Model Swarms to Unlock the Potential of Collective Intelligence',
      conferenceName: 'The Sixteenth International Conference on Swarm Intelligence 2025',
      journalName: '',
      authors: 'Noah Mamié and Susie Xi Rao',
      link: 'https://link.springer.com/chapter/10.1007/978-981-95-0982-9_20',
      description:
        'Multi-agent systems address issues of accessibility and scalability of artificial intelligence (AI) foundation models, which are often represented by large language models. We develop a framework - the “Society of HiveMind” (SOHM) - that orchestrates the interaction between multiple AI foundation models, imitating the observed behavior of animal swarms in nature by following modern evolutionary theories. On the one hand, we find that the SOHM provides a negligible benefit on tasks that mainly require real-world knowledge. On the other hand, we remark a significant improvement on tasks that require intensive logical reasoning, indicating that multi-agent systems are capable of increasing the reasoning capabilities of the collective compared to the individual agents. Our findings demonstrate the potential of combining a multitude of diverse AI foundation models to form an artificial swarm intelligence capable of self-improvement through interactions with a given environment.',
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
    },
    {
      title: 'Voting Booklet Bias: Stance Detection in Swiss Federal Communication',
      conferenceName: 'SwissText Analytics Conference 2023',
      journalName: '',
      authors: 'Eric Egli, Noah Mamié, Mathias Müller and Eyal Liron Dolev',
      link: 'https://arxiv.org/pdf/2306.08999',
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
    },
  ],
  news: [
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
