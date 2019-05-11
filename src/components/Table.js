/* eslint-disable no-console, react/no-danger */

import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import React from 'react'
import { AutoSizer, Column, SortDirection, Table } from 'react-virtualized'

const styles = theme => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box'
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: 'initial',
  },
  autoSizer: {
    overflowX: 'auto',
    minWidth: 840
  }
})

class MuiVirtualizedTable extends React.PureComponent {
  getRowClassName = ({ index }) => {
    const { classes, rowClassName, onRowClick } = this.props

    return clsx(classes.tableRow, classes.flexContainer, rowClassName, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    })
  }

  cellRenderer = ({ cellData, columnIndex = null }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
      >
        {cellData}
      </TableCell>
    )
  }

  headerRenderer = ({ label, columnIndex, dataKey, sortBy, sortDirection }) => {
    const { headerHeight, columns, classes, sort } = this.props
    const direction = {
      [SortDirection.ASC]: 'asc',
      [SortDirection.DESC]: 'desc',
    }

    const inner =
      !columns[columnIndex].disableSort && sort != null ? (
        <TableSortLabel active={dataKey === sortBy} direction={direction[sortDirection]}>
          {label}
        </TableSortLabel>
      ) : (
        <span dangerouslySetInnerHTML={{ __html: label }}/>
      )

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? 'right' : 'left'}
      >
        {inner}
      </TableCell>
    )
  }

  render () {
    const { classes, columns, ...tableProps } = this.props
    return (
      <AutoSizer className={classes.autoSizer}>
        {({ height, width }) => (
          <Table height={height} width={width} {...tableProps} rowClassName={this.getRowClassName}>
            {columns.map(({ cellContentRenderer = null, className, dataKey, ...other }, index) => {
              let renderer
              if (cellContentRenderer != null) {
                renderer = cellRendererProps =>
                  this.cellRenderer({
                    cellData: cellContentRenderer(cellRendererProps),
                    columnIndex: index,
                  })
              } else {
                renderer = this.cellRenderer
              }

              return (
                <Column
                  key={dataKey}
                  headerRenderer={headerProps =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={clsx(classes.flexContainer, className)}
                  cellRenderer={renderer}
                  dataKey={dataKey}
                  {...other}
                />
              )
            })}
          </Table>
        )}
      </AutoSizer>
    )
  }
}

MuiVirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      cellContentRenderer: PropTypes.func,
      dataKey: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
    }),
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowClassName: PropTypes.string,
  rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  sort: PropTypes.func,
}

MuiVirtualizedTable.defaultProps = {
  headerHeight: 48,
  rowHeight: 48,
}

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable)

const useStyles = makeStyles(theme => ({
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      height: 'calc(100vh - 64px)',
    }
  })
)

function capitalize (s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function formatOS (s) {
  return s === 'aix'
    ? 'AIX'
    : capitalize(s)
}

function formatImpl (s) {
  return s === 'hotspot'
    ? 'HotSpot'
    : 'OpenJ9'
}

function AOJDKVirtualizedTable (props) {
  const [sortBy, setSortBy] = React.useState('name')
  const [sortDirection, setSortDirection] = React.useState(SortDirection.DESC)

  const classes = useStyles()

  const rows = []
  let i = 0

  if (props.releases.length) props.releases.forEach(r => {
    let search
    try {
      search = RegExp(props.search)
    } catch (err) {
      search = props.search
    }
    if (
      (search instanceof RegExp && search.test(r['release_name'])) ||
      (typeof search === 'string' && r['release_name'].includes(search))
    ) r.binaries.forEach(b => {
      rows.push({
        id: i,
        name: r['release_name'],
        os: formatOS(b.os),
        arch: b.architecture,
        type: b['binary_type'].toUpperCase(),
        openjdk_impl: formatImpl(b['openjdk_impl']),
        heap_size: capitalize(b['heap_size'])
      })
      i++
    })
  })

  rows.sort((a, b) =>
    sortDirection === SortDirection.ASC
      ? a[sortBy] > b[sortBy] ? 1 : -1
      : b[sortBy] > a[sortBy] ? 1 : -1
  )

  return (
    <main className={classes.content}>
      <div className={classes.toolbar}/>
      <VirtualizedTable
        rowCount={rows.length}
        rowGetter={({ index }) => rows[index]}
        onRowClick={event => console.log(event)}
        columns={[
          {
            width: 300,
            flexGrow: 1.0,
            label: 'Name',
            dataKey: 'name',
          },
          {
            width: 150,
            label: 'OS',
            dataKey: 'os',
          },
          {
            width: 150,
            label: 'Architecture',
            dataKey: 'arch',
          },
          {
            width: 150,
            label: 'Binary Type',
            dataKey: 'type',
          },
          {
            width: 150,
            label: 'OpenJDK Implementation',
            dataKey: 'openjdk_impl',
          },
          {
            width: 150,
            label: 'Heap Size',
            dataKey: 'heap_size',
          }
        ]}
        sortBy={sortBy}
        sortDirection={sortDirection}
        sort={({ sortBy, sortDirection }) => {
          setSortBy(sortBy)
          setSortDirection(sortDirection)
        }}
      />
    </main>
  )
}

AOJDKVirtualizedTable.propTypes = {
  releases: PropTypes.arrayOf(PropTypes.object).isRequired,
  search: PropTypes.string.isRequired
}

export default AOJDKVirtualizedTable
