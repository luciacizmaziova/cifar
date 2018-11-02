import * as d3 from 'd3';

const nodesById = d3.map();

const persons = [
  {
    name: 'Hosni Mubarak',
    role: 'President',
    image: 'https://trello-attachments.s3.amazonaws.com/5bc0b20255411e16156e4aa5/5bc9d76063f97a3fe8733a54/8f82123344a63ca65a698acd5559380f/mubarak-frei-sw2-dklblau.png',
    root: true,
    network: [
      {name: 'Gamal Mubarak', role: 'Son', connection: 'family'},
      {name: 'Alaa Mubarak', role: 'Son', connection: 'family'},
      {name: 'Suzanne Mubarak', role: 'Spouse', connection: 'corporate'},
      {name: 'Gamal 2 Mubarak', role: 'Son', connection: 'corporate'},
      {name: 'Alaa 2 Mubarak', role: 'Son', connection: 'government'},
      {name: 'Suzanne 2 Mubarak', role: 'Spouse', connection: 'government'},
      {name: 'Gamal 3 Mubarak', role: 'Son', connection: 'family'},
      {name: 'Alaa 3 Mubarak', role: 'Son', connection: 'corporate'},
      {name: 'Suzanne 3 Mubarak', role: 'Spouse', connection: 'government'},
      {name: 'Gamal 4 Mubarak', role: 'Son', connection: 'family'},
      {name: 'Alaa 4 Mubarak', role: 'Son', connection: 'family'},
      {
        name: 'Suzanne 4 Mubarak',
        role: 'Spouse 2',
        connection: 'family',
        network: [
          {name: 'Alaa 5 Mubarak', role: 'Spouse', connection: 'government'},
          {name: 'Gamal 5 Mubarak', role: 'Son', connection: 'family'},
        ]
      },
    ]
  }
];

const createNodesAndLinks = person => {
  const nodes = [];
  const links = [];

  const storePerson = p => {
    const { network, ...rest } = p;
    nodes.push({...rest});
  };

  const storeLink = (target, source) => {
    links.push({
      target: target.name,
      source: source.name
    });
  };

  const interateNetwork = p => {
    storePerson(p);

    if (p.network) {
      p.network.forEach(_ => {
        interateNetwork(_);
        storeLink(_, p);
      });
    }
  }

  interateNetwork(person);

  return { nodes, links };
};

const { nodes, links } = createNodesAndLinks(persons[0]);

nodes.forEach(_ => nodesById.set(_.name, _));
links.forEach(_ => {
  _.source = nodesById.get(_.source);
  _.target = nodesById.get(_.target);
});

export { nodes, links };
