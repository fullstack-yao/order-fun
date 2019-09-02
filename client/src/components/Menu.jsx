import React, { Component } from "react";
import io from "socket.io-client";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menus: [],
      order: [],
      open: false,
      socket: null
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleOrder = this.handleOrder.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    const self = this;
    // const socket = io("http://10.1.7.89:5555/chat");
    const socket = io("http://10.1.6.190:5555/chat");

    socket.on("connect", function() {
      console.log("connect");
    });

    socket.on("message", function(data) {
      console.log("message");
      self.setState({
        menus: data.menus,
        order: data.menus.filter(group => group.amount > 0)
      });
    });

    socket.on("disconnect", function() {
      console.log("disconnected");
    });

    this.sock = socket;
  }

  handleUpdate(e, menu_id, menu_amount, group_id, sign) {
    e.preventDefault();
    if (!(menu_amount === "0" && sign === "-")) {
      this.sock.emit("update", {
        menu_id: menu_id,
        group_id: group_id,
        amount: sign + "1"
      });
    }
  }

  handleOrder(e) {
    e.preventDefault();
    this.setState({
      ...this.state,
      open: true
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.sock.emit("submission", {});
    this.setState({
      ...this.state,
      open: false
    });
  };

  handleCancel = e => {
    e.preventDefault();
    this.setState({
      ...this.state,
      open: false
    });
  };

  render() {
    const { menus, order, open } = this.state;
    const menuList = menus.map(group => (
      <div key={group.group_id}>
        <div>
          <div>
            <img src={group.img} alt="" className="circle left" />
            <h3 className="group-title">{group.name}</h3>
          </div>
        </div>

        <ul className="collection">
          {group.items.map(menu => (
            <li className="row menu-item collection-item " key={menu.menu_id}>
              <div className="menu-icon col s3 m3 l3">
                <img src={menu.img} alt="" className="circle" />
              </div>
              <div className="col s5 m5 l5">
                <span className="title">{menu.name}</span>
                <p className="title">
                  {"$" + menu.price} <br />
                  {"Pieces: " + menu.piece}
                </p>
              </div>
              <div className="col s4 m4 l4">
                <div className="row menu-badge">
                  <span className="new badge black-text" data-badge-caption="">
                    {menu.amount}
                  </span>
                </div>
                <div className="row">
                  <a
                    className="btn-floating menu-button"
                    onClick={e =>
                      this.handleUpdate(
                        e,
                        menu.menu_id,
                        menu.amount,
                        group.group_id,
                        "+"
                      )
                    }
                  >
                    <i className="small material-icons">add</i>
                  </a>
                  <a
                    className="btn-floating menu-button"
                    onClick={e =>
                      this.handleUpdate(
                        e,
                        menu.menu_id,
                        menu.amount,
                        group.group_id,
                        "-"
                      )
                    }
                  >
                    <i className="material-icons">remove</i>
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    ));

    let totalPrice = 0;
    const orderList = order.map(group => (
      <div key={group.group_id}>
        <div>{group.name}</div>
        <ul className="collection">
          {group.items.map(menu => {
            if (menu.amount > 0) {
              totalPrice += menu.price * menu.amount;
              return (
                <li className="row collection-item menu-item" key={menu.menu_id}>
                  <div className="col s4 m4 l4 menu-icon">
                    <img src={menu.img} alt="" className="circle" />
                  </div>
                  <div className="col s5 m5 l5">
                    <span className="title">{menu.name}</span>
                    <p className="title">
                      {"$" + menu.price + " X " + menu.amount}
                    </p>
                  </div>
                  <div className="col s3 m3 l3">
                    <div className="title menu-badge">
                      {"$" + menu.price * menu.amount}
                    </div>
                  </div>
                </li>
              );
            }
          })}
        </ul>
      </div>
    ));

    return (
      <div className="menu">
        <div className="row">
          <div className="col s9 m9 l9 order-status">
            {menus.map(
              group =>
                group.amount > 0 && (
                  <div className="col s12 m12 l12" key={group.group_id}>
                    {group.name + ":" + group.amount}
                  </div>
                )
            )}
          </div>
          <div className="col s3 m3 l3">
            <a
              className="btn waves-effect waves-light modal-trigger order-button"
              data-target="modal1"
              onClick={this.handleOrder}
            >
              Order
            </a>
          </div>
        </div>
        <div className="row center">{menuList}</div>

        <Dialog open={open} disableBackdropClick={false}>
          <DialogTitle>
            <div>
              <h5>Your Order</h5>
            </div>
          </DialogTitle>
          <DialogContent className="dialog">
            <DialogContentText>{orderList}</DialogContentText>
            <div className="right">Total: $ {totalPrice.toFixed(2)}</div>
          </DialogContent>
          <DialogActions>
            <button
              className="btn waves-effect waves-light"
              onClick={this.handleCancel}
            >
              Close
            </button>
            <button
              className="btn waves-effect waves-light"
              onClick={this.handleSubmit}
            >
              Submit
              <i className="material-icons right">send</i>
            </button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
