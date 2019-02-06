import React, { Component } from 'react'
import { Animated, TouchableWithoutFeedback, Alert } from 'react-native'
import { number, func, any, array } from 'prop-types'

export default class TouchableScale extends Component {
  static propTypes = {
    activeScale: number,
    onPress: func,
    onPressIn: func,
    onPressOut: func,
    children: any,
    style: any,
    activeStyle: any,
    activeIndicies: array
  }

  animatedValue = new Animated.Value(1)


  state = {
    isFocused: false
  }

  render() {
    let { animatedValue } = this
    let { isFocused } = this.state
    let animatedStyle = {
      transform: [{ scale: animatedValue }],
    }


    let {
      onPress,
      onPressIn,
      onPressOut,
      style,
      activeStyle,
      children,
      activeIndicies,
      activeScale } = this.props

    children = React.Children.toArray(children)

    if (Array.isArray(children)) {
      if (isFocused) {
        activeIndicies.forEach((i) => {
          children[i] = React.cloneElement(children[i], {
            style: [children[i].props.style, activeStyle]
          })
        })
      }
    } else {
      children = isFocused ? React.cloneElement(children, {
        style: [children.props.style, activeStyle]
      }) : children
    }

    return (
      <TouchableWithoutFeedback
        onPressIn={(args) => {
          Animated.spring(animatedValue, {
            toValue: activeScale
          }).start()
          this.setState({ isFocused: true })
          onPressIn && onPressIn(args)
        }}
        onPressOut={(args) => {
          Animated.spring(animatedValue, {
            toValue: 1
          }).start()
          this.setState({ isFocused: false })
          onPressOut && onPressOut(args)
        }}
        onPress={onPress}
      >
        <Animated.View style={[animatedStyle, style]}>
          {children}
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

TouchableScale.defaultProps = {
  activeScale: 1.03,
  activeIndicies: [0]
}
