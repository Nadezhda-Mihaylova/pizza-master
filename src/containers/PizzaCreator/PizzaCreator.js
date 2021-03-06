import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Aux from '../../hoc/Aux/Aux';
import Pizza from '../../components/Pizza/Pizza';
import CreatePizzaControls from '../../components/Pizza/CreatePizzaControls/CreatePizzaControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderInformation from '../../components/Pizza/OrderInformation/OrderInformation';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';

class PizzaCreator extends Component {
    state = {
        purchasing: false
    }

    componentDidMount() {
        console.log(this.props); 
        this.props.onInitProducts();    
    }

    updatePurchaseState(products) {
        const sum = Object.keys(products)
            .map(prodKey => {
                return products[prodKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        return sum > 0;
    }

    purchaseHandler = () => {
        if (this.props.isAuthenticated) {
            this.setState( { purchasing: true } );
        } else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    }

    purchaseCancelHandler = () => {
        this.setState( { purchasing: false } );
    }

    purchaseContinueHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    render() {
        const disabledInfo = {
            ...this.state.productsAmount
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let order = null;
        let pizza = this.state.error ? <p>Products can't be loaded!</p> : <Spinner/>

        if (this.props.productsAmount) {
            pizza = (
                <Aux>
                    <Pizza products={this.props.productsAmount} />
                    <CreatePizzaControls
                        ingredientAdded={this.props.onProductAdded}
                        ingredientRemoved={this.props.onProductRemoved}
                        disabled={disabledInfo}
                        purchasable={this.updatePurchaseState(this.props.productsAmount)}
                        ordered={this.purchaseHandler}
                        isAuth={this.props.isAuthenticated}
                        price={this.props.price} />
                </Aux>
            );
            order = <OrderInformation
                products={this.props.productsAmount}
                price={this.props.price.toFixed(2)}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {order}
                </Modal>
                {pizza}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        productsAmount: state.pizzaCreator.products,
        price: state.pizzaCreator.totalPrice,
        error: state.pizzaCreator.error,
        isAuthenticated: state.auth.token !== null 
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onProductAdded: (productName) => dispatch(actions.addProduct(productName)),
        onProductRemoved: (productName) => dispatch(actions.removeProduct(productName)),
        onInitProducts: () => dispatch(actions.initProducts()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PizzaCreator));