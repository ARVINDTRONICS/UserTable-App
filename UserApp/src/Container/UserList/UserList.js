import React, { Component } from "react";
import "./UserList.css";
import { USERS } from "../../Constants/constants";
import {
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
import TableHeader from "../../UserTable/TableHeader/TableHeader";
import UserTable from "../../UserTable/UserTable";
import AddUser from "../../AddUser/AddUser";

class UserList extends Component {
  state = {
    search: false,
    isSorted: false,
    isModal: false,
    modalType: "",
    userData: [],
    searchData: [],
    userEditId: "",
  };

  componentDidMount = () => {
    this.setState({ userData: USERS });
  };

  filterData = (search) => {
    if (search.length >= 2) {
      let copy = [...this.state.userData];
      let searched = copy.filter((obj) => {
        return Object.values(obj).some((val) => val.includes(search));
      });
      this.setState({ searchData: searched, search: true });
    } else {
      this.setState({ search: false });
    }
  };

  compareByAsc = (key) => {
    if (this.state.isSorted) {
      return function (a, b) {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
      };
    } else {
      return function (a, b) {
        if (a[key] < b[key]) return 1;
        if (a[key] > b[key]) return -1;
        return 0;
      };
    }
  };

  sortData = (key) => {
    console.log(key);
    let copy = [...this.state.userData];
    copy.sort(this.compareByAsc(key));

    this.setState({ userData: copy }, () => {
      this.setState({ isSorted: !this.state.isSorted });
    });
  };

  handleModal = (type, id) => {
    this.setState({ isModal: true, modalType: type, userEditId: id });
  };
  handleSubmit = (newUser) => {
    if (this.state.modalType === "Edit") {
      let editedData = [...this.state.userData];
      editedData.splice(this.state.userEditId, 1, newUser);
      this.setState({ userData: editedData });
    } else {
      this.setState({ userData: [...this.state.userData, newUser] });
    }
  };

  deleteUser = (id) => {
    let editedData = [...this.state.userData];
    editedData.splice(id, 1);
    this.setState({ userData: editedData });
  };

  render() {
    return (
      <Container>
        <TableHeader
          filterData={this.filterData}
          handleModal={this.handleModal}
        />
        <UserTable
          handleModal={this.handleModal}
          userData={this.state.userData}
          searchData={this.state.searchData}
          deleteUser={this.deleteUser}
          sortData={this.sortData}
          search={this.state.search}
        />
        <Dialog
          open={this.state.isModal}
          onClose={() => this.setState({ isModal: false })}
        >
          <DialogTitle></DialogTitle>
          <DialogContent>
            <AddUser
              modalType={this.state.modalType}
              closeModal={() => this.setState({ isModal: false })}
              handleSubmit={this.handleSubmit}
              currentUser={USERS[this.state.userEditId]}
            />
          </DialogContent>
        </Dialog>
      </Container>
    );
  }
}

export default UserList;
