import React from 'react';

import Person from './person';

export default ({ persons }) => <ul>
  {persons && persons.map(({ node }) => <Person key={node.frontmatter.title} {...node.frontmatter} />)}
</ul>;
