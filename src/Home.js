import './App.css';
import {connect} from 'react-redux'
import {createUseStyles} from 'react-jss'
import {setPageNumber, setPerPageNumber, setQuery, setSearchResults, setSort, setSortOrder, setError} from './effects/index'
import ascending from './ascending.png'
import descending from './descending.png'

const useStyles = createUseStyles({
  searchBar: {
    margin: '50px'
  },
  header: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr'
  },
  userCount: {    
    fontSize: '24px'
  },
  hidden: {
    visibility: 'hidden'
  },
  headerLinks: {
    display: 'grid',
    gridTemplateColumns: '2fr 2fr 1fr 2fr 6fr',
    gridGap: '10px',
  },
  sortContainer: {
    display: 'flex',
  },
  sortOrder: {
    paddingLeft: '5px',
    alignSelf: 'center',
    height: '24px',
    width: '24px'
  },
  userGrid: {
    display: 'grid',
    gridTemplateColumns: '3fr 6fr 3fr',
    gridGap: '30px',
    padding: '30px 0'
  },
  userRowContainer: {
    border: '#21262d solid 1px',
    backgroundColor: '#73787d',
    width: '100%'
  },
  userRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 6fr 1fr',
    padding: '30px'
  },
  avatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50px',
    alignSelf: 'center'
  },
  userName: {
    textDecoration: 'none',
    color: 'white',
    alignSelf: 'center',
    justifySelf: 'left'
  },
  linksContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '20px'
  },
  linkButtons: {
    textDecoration: 'none',
    appearance: 'button',
    backgroundColor: '#21262d',
    border: '#73787d solid 1px',
    color: '#c9d1d9',
    width: '70px',
    padding: '10px',
  },
  numberButtons: {
    textDecoration: 'none',
    appearance: 'button',
    backgroundColor: '#21262d',
    border: '#73787d solid 1px',
    color: '#c9d1d9',
    padding: '10px',
  },
  footerNav: {
    display: 'grid',
    gridTemplateColumns: '15fr repeat(5, 1fr) 2fr 2fr 15fr',
    gridGap: '20px'
  }
})

const Home  = ({
  searchResults, 
  query, 
  page, 
  perPage, 
  sort,
  sortOrder,
  error,
  ...props
}) => {
  const fetchUsers = async(newPage, newPerPage, newSort, newOrder) => {
    const result = await fetch(
      `https://api.github.com/search/users?q=${query}&page=${parseInt(newPage)}&per_page=${parseInt(newPerPage)}${newSort === 'followers' || newSort === 'repositories' ? `&sort=${newSort}` : ``}${newOrder === 'ascending' || newOrder === 'descending' ? `&order=${newOrder}` : ``}`)
    if(result.ok){
      const response = await result.json()
      props.setSearchResults(response)
    } else {
      props.setError('Something went wrong with your search. Please try again')
    }
  }
  const classes = useStyles()
  const handleSearchChange = e => {
    const value = e.target.value
    props.setQuery(value)
  }

  const handleSearchSubmit = async(e) => {
    e.preventDefault()
    props.setError('')
    const result = await fetch(`https://api.github.com/search/users?q=${query}&page=1&per_page=${perPage}`)
    if(result.ok){
      const response = await result.json()
      console.log(response)
      props.setSearchResults(response)
      props.setPageNumber(1)
    } else {
      props.setError('Something went wrong with your search. Please try again')
    }
  }

  const handleChangePage = (newPage) => {
    props.setPageNumber(newPage)
    fetchUsers(newPage, perPage, sort, sortOrder)
  }
  const handlePreviousPage = () => {
    const newPage = parseInt(page) - 1
    props.setPageNumber(newPage)
    fetchUsers(newPage, perPage, sort, sortOrder)
  }
  const handleNextPage = () => {
    const newPage = parseInt(page) + 1
    props.setPageNumber(newPage)
    fetchUsers(newPage, perPage, sort, sortOrder)
  }
  const handleChangePerPage = (e) => {
    const newPerPage = e.target.value
    props.setPageNumber(1)
    props.setPerPageNumber(newPerPage)
    fetchUsers(1, newPerPage, sort, sortOrder)
  }
  const handleChangeSort = (e) => {
    const newSort = e.target.value
    if(newSort === '') props.setSortOrder('')
    props.setPageNumber(1)
    props.setSort(newSort)
    fetchUsers(1, perPage, newSort, sortOrder)
  } 
  const handleChangeSortOrder = (newOrder) => {
    props.setPageNumber(1)
    props.setSortOrder(newOrder)
    fetchUsers(1, perPage, sort, newOrder)
  }
  const orderIcon = sortOrder === 'ascending' ? 
                        descending
                      : 
                        sortOrder === 'descending' ? 
                          ascending
                        : 
                          descending
  const orderValue = sortOrder === 'ascending' ? 
                      'descending'
                    : 
                      sortOrder === 'descending' ? 
                        'ascending'
                      : 
                        'descending'
  return (
    <div className='App'>
      <form onSubmit={handleSearchSubmit}>
        <input 
          className={classes.searchBar} 
          type='text' 
          placeholder='Search users' 
          value={query} 
          onChange={handleSearchChange}
        />
        <button>Search</button>
      </form>
      {error ?
        <div>{error}</div>
      :
        searchResults && searchResults.items ?
          <>
            <div className={classes.header}>
              <div></div>
              <div 
                className={classes.userCount}
              >
                {searchResults.total_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} users {/* used regex found from stack overflow here  */}
              </div> 
              <div className={classes.headerLinks}>
                <button 
                  className={page > 1 ? classes.linkButtons : classes.hidden}
                  onClick={handlePreviousPage}
                >
                  Previous
                </button> 
                <button 
                  className={classes.linkButtons}
                  onClick={handleNextPage}
                >
                  Next
                </button>
                <select 
                  value={perPage} 
                  onChange={handleChangePerPage}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                  <option value={50}>50</option>
                  <option value={60}>60</option>
                  <option value={70}>70</option>
                  <option value={80}>80</option>
                  <option value={90}>90</option>
                  <option value={100}>100</option>
                </select>
                <div className={classes.sortContainer}>
                  <select 
                    value={sort} 
                    onChange={handleChangeSort}
                  >
                    <option value=''>best match</option>
                    <option value='followers'>followers</option>
                    <option value='repositories'>repositories</option>
                  </select>
                  {sort === 'followers' || sort === 'repositories' ?
                    <img 
                      src={orderIcon} 
                      alt={orderIcon}
                      className={classes.sortOrder} 
                      onClick={() => handleChangeSortOrder(`${orderValue}`)}/>
                  :
                    null
                  }
                </div>
              </div>
            </div>
            {searchResults.items.map(user => (
              <div key={user.id} className={classes.userGrid}>
                <div/>
                <div 
                  className={classes.userRowContainer} 
                >
                  <div className={classes.userRow} >
                    <img 
                      src={user.avatar_url} 
                      alt='user avatar' 
                      className={classes.avatar} 
                    />
                    <a 
                      href={user.html_url} 
                      className={classes.userName}
                    >
                      {user.login}
                    </a>
                    <div className={classes.linksContainer} >
                      <a 
                        href={user.followers_url} 
                        className={classes.linkButtons}
                      >
                        {console.log(user.follower_count)} Followers
                      </a>
                      <a 
                        href={user.starred_url} 
                        className={classes.linkButtons}
                      >
                        Starred
                      </a>
                    </div>
                  </div>
                </div>
                <div />
              </div>
            ))}
            <div className={classes.footerNav} >
              <div />
              {page > 3 ?
                <> 
                  <button 
                    className={classes.numberButtons} 
                    onClick={() => handleChangePage(parseInt(page) - 2)}
                  >{page - 2}</button>
                  <button 
                    className={classes.numberButtons} 
                    onClick={() => handleChangePage(parseInt(page) - 1)}
                  >{page - 1}</button>
                  <button 
                    className={classes.numberButtons} 
                    onClick={() => handleChangePage(page)}
                  >{page}</button>
                  <button 
                    className={classes.numberButtons} 
                    onClick={() => handleChangePage(parseInt(page) + 1)}
                  >{page + 1}</button>
                  <button 
                    className={classes.numberButtons} 
                    onClick={() => handleChangePage(parseInt(page) + 2)}
                  >{page + 2}</button>
                </>
              :
                <>
                  <button 
                    className={classes.numberButtons} 
                    onClick={() => handleChangePage(1)}
                  >{1}</button>
                  <button 
                    className={classes.numberButtons} 
                    onClick={() => handleChangePage(2)}
                  >{2}</button>
                  <button 
                    className={classes.numberButtons} 
                    onClick={() => handleChangePage(3)}
                  >{3}</button>
                  <button 
                    className={classes.numberButtons} 
                    onClick={() => handleChangePage(4)}
                  >{4}</button>
                  <button 
                    className={classes.numberButtons} 
                    onClick={() => handleChangePage(5)}
                  >{5}</button>
                </>
              }
              <button 
                className={parseInt(page) > 1 ? classes.linkButtons : classes.hidden} 
                onClick={handlePreviousPage}
              >
                Previous
              </button> 
              <button 
                className={classes.linkButtons} 
                onClick={handleNextPage}
              >
                Next
              </button>
            </div>
          </>
        :
          null
      }
    </div>
  )
}

const mapStateToProps = state => ({
  searchResults: state.searchResults,
  query: state.query,
  page: state.page,
  sort: state.sort,
  sortOrder: state.sortOrder,
  perPage: state.perPage,
  error: state.error
})

const mapDispatchToProps = dispatch => ({
  setPageNumber: newPage => dispatch(setPageNumber(newPage)),
  setPerPageNumber: newPerPage => dispatch(setPerPageNumber(newPerPage)),
  setQuery: newQuery => dispatch(setQuery(newQuery)),
  setSearchResults: results => dispatch(setSearchResults(results)),
  setSort: newSort => dispatch(setSort(newSort)),
  setSortOrder: newSortOrder => dispatch(setSortOrder(newSortOrder)),
  setError: error => dispatch(setError(error))
})


export default connect(mapStateToProps, mapDispatchToProps)(Home)