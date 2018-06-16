### Dataset
I used a PostgreSQL database. 

The database structure can be found in `./database/schema.sql`. There's just one table with a couple of columns, which represents the ImageNet tree structure using MPTT. It's a pretty common algorithm for storing hierarchial data structures in a relational database, and I choosed this interpretation because I used it in my previous project at Edvisor. The biggest advantage of this representation is it's extremely cheap selection of any sub-tree. On the other hand, the INSERT/UPDATE operations are a bit more expensive, since the MPTT index has to be rebuilt, and all the tuples must be updated. So it's not very suitable for databases with MVCC implementation like the one in PostgreSQL. 

The database seed is stored in `./database/data.sql`. 

### Frontend
You can start the frontend application with `npm run start-client`, and it's accessible on `http://localhost:8080/`. I used:
- Webpack
- Typescript (This is a must. Type safety is extremely important in software development)
- ReactJS
- RamdaJS (Some people love it, some people hate it. I think it's needed when building a fully functional & pure code)
- Apollo client (GQL queries -> see #Backend section)
..and a couple more libraries. 

I haven't used tools like Redux, because it's not needed for such a small application. 

### Backend
You can start the backend application with `npm run start-server`, and it's accessible on `http://localhost:4000/`. The original assigmnent required a single http-response with a predefined JSON format. I'm not sure if these old-style typeless interfacess makes sense today, so I decided to use a type-safe GraphQL protocol. There's 1 GQL query, which returns a single text field, where the JSON is stringified. It doesn't really make sense in current implementation, but the GQL schema can be easily extended. 

The backend api use no environment variables, so it may require some manual configuration directly in the sourcecode (`./server.js` -> Sequelize connector definition)

Sice I used MPTT, the complexity of the `build-tree` algorithm is O(n).

Tests can be ran with `npm test` command (there're just a couple demonstrational tests). 
