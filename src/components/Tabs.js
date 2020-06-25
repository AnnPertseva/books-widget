import React from "react";
import { Link } from "react-router-dom"
import queryString from 'query-string';
import '../styles/Tabs.css';

function Tabs(props) {

  function getLink(tab, tags) {
    const linkTab = (tab === 'toread') ? undefined : tab;
    const lingTags = (tags.length > 0) ? tags: undefined;
    if (linkTab || lingTags) {
      return '/?' + queryString.stringify({'tab': linkTab, 'tags': lingTags}, {arrayFormat: 'comma'});
    }
    return '/'
  }

  const tabsList = props.tabs.map((tab) =>
    <Link
      to={getLink(tab.id, props.tags)}
      key={tab.id}
      onClick={(e) => props.onClick(tab.id, e)}
      className={props.active === tab.id ? 'active tab' : 'tab'}
    >
      {tab.name}
    </Link>
  );

  return (
    <div className="tabs">
      {tabsList}
    </div>
  );
}
export default Tabs