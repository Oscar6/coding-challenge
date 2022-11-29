import * as React from "react";
import fetchContributorData from "../src/fetchContributorData";

export default function ContributorList() {
  const [users, setUsers] = React.useState([]);
  const [rankSort, setRankSort] = React.useState("Commits");

  async function getContributorData() {
    try {
      const response = await fetchContributorData();
      // Looping through user actions on load for addition and deletion
      response.forEach((user, idx) => {
        let deletedCount = 0;
        let additionCount = 0;
        user.weeks.forEach((x) => {
          deletedCount = deletedCount + x.d;
          additionCount = additionCount + x.a;
        });
        response[idx].deletedTotal = deletedCount;
        response[idx].additionTotal = additionCount;
      });
      sortByDropdown("Commits", response);
    } catch (error) {}
  }

  function sortByDropdown(type, usersResponse) {
    setRankSort(type);
    const usersSort = usersResponse ? usersResponse : users;
    if (type === "Commits") {
      setUsers(
        usersSort.sort((a, b) => {
          if (a.total < b.total) {
            return 1;
          } else if (a.total > b.total) {
            return -1;
          } else {
            return 0;
          }
        })
      );
    } else if (type === "Additions") {
      setUsers(
        usersSort.sort((a, b) => {
          if (a.additionTotal < b.additionTotal) {
            return 1;
          } else if (a.additionTotal > b.additionTotal) {
            return -1;
          } else {
            return 0;
          }
        })
      );
    } else if (type === "Deleted") {
      setUsers(
        usersSort.sort((a, b) => {
          if (a.deletedTotal < b.deletedTotal) {
            return 1;
          } else if (a.deletedTotal > b.deletedTotal) {
            return -1;
          } else {
            return 0;
          }
        })
      );
    }
  }

  React.useEffect(() => {
    getContributorData();
  }, []);

  // Dropdown toggle function
  function toggleDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  return (
    <>
      <h1>Contributors to newrelic/node-newrelic</h1>
      <div class="flex-container">
        <p>February 5, 2012 - July 23, 2016</p>
        <div class="dropdown">
          <button onClick={() => toggleDropdown()} class="dropbtn">
            Sort By: {rankSort} &#9660;
          </button>
          <div id="myDropdown" class="dropdown-content">
            <a
              onClick={() => {
                sortByDropdown("Commits");
                toggleDropdown();
              }}
            >
              Commits
            </a>
            <a
              onClick={() => {
                sortByDropdown("Additions");
                toggleDropdown();
              }}
            >
              Additions
            </a>
            <a
              onClick={() => {
                sortByDropdown("Deleted");
                toggleDropdown();
              }}
            >
              Deleted
            </a>
          </div>
        </div>
      </div>

      <div class="flex-table">
        {/* mapping through data */}
        {users &&
          users.length > 0 &&
          users.map((userObj, index) => (
            <table class="table">
              <div>
                <td style={{ fontWeight: "bold" }}>{index + 1}.</td>
                <td>
                  <img src={userObj.author.avatar_url} width="25" height="25" />
                </td>
                <td>
                  <a href={userObj.author.html_url}>{userObj.author.login}</a>
                </td>
              </div>
              <div>
                <td>{userObj.total} commits</td>
                <td style={{ color: "grey" }}>/</td>
                <td style={{ color: "green" }}>{userObj.additionTotal}++</td>
                <td style={{ color: "grey" }}>/</td>
                <td style={{ color: "red" }}>{userObj.deletedTotal}--</td>
              </div>
            </table>
          ))}
      </div>
    </>
  );
}
