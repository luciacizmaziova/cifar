import Link from 'gatsby-link';
import React, { Component, lazy, Suspense } from 'react';

import Constraint from '../constraint';
import Loading from '../loading';
import Person from './person';
import styles, {
  viewSwitchStyles,
  viewSwitchActiveStyles,
  viewIconStyles
} from './styles';

import findImageById from '../../lib/find-image-by-id';
import ListIcon from '../../static/list-ul.svg';
import NetworkIcon from '../../static/share-alt.svg';

const Network = lazy(() => import('../network'));

const extractFrontmatter = persons =>
  persons.map(person => person.node.frontmatter);

const filterPersonsByName = (persons, name) => {
  if (!name) {
    return persons;
  }

  return persons.filter(
    ({
      node: {
        frontmatter: { name: personName, aliases, nativeName }
      }
    }) =>
      personName.includes(name) ||
      nativeName.includes(name) ||
      aliases.find(alias => alias.includes(name))
  );
};

export default class PersonList extends Component {
  state = {
    persons: [],
    view: 'list',
    filter: ''
  };

  constructor(props) {
    super(props);

    this.state.persons = props.persons;
  }

  updateNameFilter = name => {
    const { persons } = this.props;

    this.setState(state => ({
      ...state,
      filter: name,
      persons: filterPersonsByName(persons, name)
    }));
  };

  render() {
    const { persons: initialPersons, images, slug } = this.props;
    const { persons, view, filter } = this.state;
    const url = typeof window !== 'undefined' && new URL(window.location.href);
    const hasInitialPersons = initialPersons && initialPersons.length > 0;
    const showGraphSwitch = hasInitialPersons && slug !== 'all';
    const showGraph =
      (url && url.searchParams.get('view') === 'network') || view === 'network';
    const showFilter = hasInitialPersons && !showGraph;

    return (
      <>
        <Constraint>
          <style jsx>{styles}</style>
          {viewSwitchStyles.styles}
          {viewSwitchActiveStyles.styles}
          {viewIconStyles.styles}

          <div className="filter-container">
            {showFilter && (
              <form
                onSubmit={event => {
                  event.preventDefault();

                  const formData = new FormData(event.target);
                  const name = formData.get('name-filter');

                  this.updateNameFilter(name);
                }}
              >
                <div className="filter">
                  {/* eslint-disable-next-line */}
                  <label htmlFor="name-filter" className="filter-label">
                    Filter by name
                  </label>

                  <input
                    type="text"
                    name="name-filter"
                    id="name-filter"
                    className="filter-input"
                    defaultValue={filter}
                    onChange={event => {
                      this.updateNameFilter(event.target.value);
                    }}
                  />
                </div>
              </form>
            )}

            {showGraphSwitch && (
              <div className="view">
                <span className="view-label">View as</span>

                {showGraph ? (
                  <Link
                    className={viewSwitchStyles.className}
                    to={`/persons/${slug}/`}
                  >
                    <ListIcon className={viewIconStyles.className} />
                    List
                  </Link>
                ) : (
                  <span className={viewSwitchActiveStyles.className}>
                    <ListIcon className={viewIconStyles.className} /> List
                  </span>
                )}
                {showGraph ? (
                  <span className={viewSwitchActiveStyles.className}>
                    <NetworkIcon className={viewIconStyles.className} />
                    Network
                  </span>
                ) : (
                  <Link
                    className={viewSwitchStyles.className}
                    to={`/persons/${slug}/?view=network`}
                  >
                    <NetworkIcon className={viewIconStyles.className} />
                    Network
                  </Link>
                )}
              </div>
            )}
          </div>

          {!showGraph && (
            <ul className="person-list">
              {persons &&
                persons.length > 0 &&
                persons.map(({ node }) => (
                  <Person
                    key={node.frontmatter.name}
                    image={findImageById(images.edges, node.frontmatter.id)}
                    {...node}
                  />
                ))}
            </ul>
          )}
        </Constraint>

        {showGraph && (
          <Suspense fallback={<Loading />}>
            <Network
              data={extractFrontmatter(initialPersons)}
              images={images.edges}
            />
          </Suspense>
        )}
      </>
    );
  }
}
