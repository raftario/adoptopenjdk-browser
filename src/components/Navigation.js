import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import List from '@material-ui/core/List'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import HSIcon from '@material-ui/icons/BarChart'
import ImplIcon from '@material-ui/icons/Build'
import TypeIcon from '@material-ui/icons/Code'
import VersionIcon from '@material-ui/icons/Bookmark'
import OSIcon from '@material-ui/icons/Computer'
import ReleaseIcon from '@material-ui/icons/Label'
import ArchIcon from '@material-ui/icons/Memory'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import PropTypes from 'prop-types'
import React from 'react'
import FilterMenu from './FilterMenu'

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200
      }
    }
  }
}))

function Navigation (props) {
  const { container } = props
  const classes = useStyles()
  const theme = useTheme()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  function handleDrawerToggle () {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <FilterMenu collapseTitle='Version'
          collapseIcon={<VersionIcon />}
          filterItems={['OpenJDK 8 (LTS)', 'OpenJDK 9', 'OpenJDK 10', 'OpenJDK 11 (LTS)', 'OpenJDK 12 (Latest)']}
          filters={props.filters}
          filterId={'version'}
          handleFilters={props.handleFilters}
        />
        <FilterMenu collapseTitle='OS'
          collapseIcon={<OSIcon />}
          filterItems={['Windows', 'Linux', 'Mac', 'AIX', 'Solaris']}
          filters={props.filters}
          filterId={'os'}
          handleFilters={props.handleFilters}
        />
        <FilterMenu collapseTitle='Architecture'
          collapseIcon={<ArchIcon />}
          filterItems={['x64', 'x32', 'ppc64', 's390x', 'ppc64le', 'aarch64', 'sparcv9']}
          filters={props.filters}
          filterId={'arch'}
          handleFilters={props.handleFilters}
        />
        <FilterMenu collapseTitle='Binary Type'
          collapseIcon={<TypeIcon />}
          filterItems={['JDK', 'JRE']}
          filters={props.filters}
          filterId={'type'}
          handleFilters={props.handleFilters}
        />
        <FilterMenu collapseTitle='OpenJDK Implementation'
          collapseIcon={<ImplIcon />}
          filterItems={['HotSpot', 'OpenJ9']}
          filters={props.filters}
          filterId={'openjdk_impl'}
          handleFilters={props.handleFilters}
        />
        <FilterMenu collapseTitle='Heap Size'
          collapseIcon={<HSIcon />}
          filterItems={['Normal', 'Large']}
          filters={props.filters}
          filterId={'heap_size'}
          handleFilters={props.handleFilters}
        />
        <FilterMenu collapseTitle='Release'
          collapseIcon={<ReleaseIcon />}
          filterItems={['Latest']}
          filters={props.filters}
          filterId={'release'}
          handleFilters={props.handleFilters}
        />
      </List>
    </div>
  )

  return (
    <>
      <CssBaseline />
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='Open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant='h6' noWrap>
            AdoptOpenJDK
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder='Search…'
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              value={props.search}
              onChange={props.handleSearch}
            />
          </div>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        <Hidden smUp implementation='css'>
          <Drawer
            container={container}
            variant='temporary'
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation='css'>
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant='permanent'
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </>
  )
}

Navigation.propTypes = {
  filters: PropTypes.shape({
    version: PropTypes.arrayOf(PropTypes.string),
    os: PropTypes.arrayOf(PropTypes.string),
    arch: PropTypes.arrayOf(PropTypes.string),
    type: PropTypes.arrayOf(PropTypes.string),
    openjdk_impl: PropTypes.arrayOf(PropTypes.string),
    heap_size: PropTypes.arrayOf(PropTypes.string),
    release: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  search: PropTypes.string.isRequired,
  handleFilters: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired
}

export default Navigation
