import { graphql } from 'gatsby';
import React from 'react';

import Report from '../../components/report';
import withLayout from '../../components/with-layout';
import withNavigation from '../../components/with-navigation';

const Page = ({ data }) => {
  const { edges } = data.allMarkdownRemark;
  return (
    <div>
      <Report {...edges[0].node} />
    </div>
  );
};

export default withNavigation(withLayout(Page));

export const query = graphql`
  query Report {
    allMarkdownRemark(
      filter: {
        fields: { folder: { eq: "pages" }, fileName: { eq: "report.md" } }
      }
    ) {
      ...report
    }
  }
`;
