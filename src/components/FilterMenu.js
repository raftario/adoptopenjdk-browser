import Checkbox from '@material-ui/core/Checkbox'
import Collapse from '@material-ui/core/Collapse'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import PropTypes from 'prop-types'
import React from 'react'

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}))

function FilterMenu (props) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  function handleClick () {
    setOpen(!open)
  }

  return (
    <>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          {props.collapseIcon}
        </ListItemIcon>
        <ListItemText primary={props.collapseTitle}/>
        {open ? <ExpandLess/> : <ExpandMore/>}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem key="any" dense button onClick={e => {
            e.stopPropagation()
            props.handleFilters('any', props.filterId)
          }} className={classes.nested}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={props.filters[props.filterId].indexOf('any') !== -1}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText primary="Any"/>
          </ListItem>
          {props.filterItems.map(val =>
            <ListItem key={val.toLowerCase()}
                      dense
                      button
                      onClick={e => {
                        e.stopPropagation()
                        props.handleFilters(val.toLowerCase(), props.filterId)
                      }}
                      className={classes.nested}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={props.filters[props.filterId].indexOf(val.toLowerCase()) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={val}/>
            </ListItem>
          )}
        </List>
      </Collapse>
    </>
  )
}

FilterMenu.propTypes = {
  collapseTitle: PropTypes.string.isRequired,
  collapseIcon: PropTypes.node.isRequired,
  filters: PropTypes.shape({
    os: PropTypes.arrayOf(PropTypes.string),
    arch: PropTypes.arrayOf(PropTypes.string),
    type: PropTypes.arrayOf(PropTypes.string),
    openjdk_impl: PropTypes.arrayOf(PropTypes.string),
    heap_size: PropTypes.arrayOf(PropTypes.string),
    release: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  filterItems: PropTypes.arrayOf(PropTypes.string),
  filterId: PropTypes.string.isRequired,
  handleFilters: PropTypes.func.isRequired
}

export default FilterMenu
