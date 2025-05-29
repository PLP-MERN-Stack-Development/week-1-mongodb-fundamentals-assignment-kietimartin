// TASK 1
// Creating the database
// use plp_bookstore;

// Creating the "books" collection
// db.createCollection("books");

// TASK 2 : CRUD operations.
// Finding books of a specific genre (Fiction is the genre i choose).
db.books.find({genre:"Fiction"});

// Finding books published after a certain year (1950)
db.books.find({published_year: { $gte : 1950}});

// Finding books by a specific author (Ray Bradbury)
db.books.find({author: "Ray Bradbury"});

// Update the price of "The Alchemist" from 10.99 to 5.99
db.books.updateOne(
  {title : "The Alchemist"},
  {$set : {price : 5.99}}
);

// Deleting a book by its title
db.books.deleteOne({title: "Moby Dick"});

// TASK 3
// Finding books that are in stock and published after 2010
// i used projection to select only the author, title and price fields
db.books.find({ $and: [{published_year: {$gte:2010 }}, {in_stock: true}]}, {title: 1, author: 1, price: 1});

// Sorting the books by price both ascending and descending
// descending order and using skip and limit to control page display
db.books.find({}, {_id: 0, title:1, author:1, price:1}).sort({ price:-1 }).limit(5);
db.books.find({}, {_id: 0, title:1, author:1, price:1}).sort({ price:-1 }).skip(5).limit(5);
db.books.find({}, {_id: 0, title:1, author:1, price:1}).sort({ price:-1 }).skip(10).limit(5);
db.books.find({}, {_id: 0, title:1, author:1, price:1}).sort({ price:-1 }).skip(15).limit(5);

// ascending order
db.books.find({}, {_id: 0, title:1, author:1, price:1}).sort({ price: 1 });

// TASK 5 (Note: Original script had a typo, assuming intended 'TASK 4' or just 'Aggregation')
// An aggregation pipeline to calculate average price of books by genre
db.books.aggregate([
  { $group: {_id: "$genre", averagePrice: { $avg: "$price"}}}
]);

// Create an aggregation pipeline to find the author with the most books in the collection
db.books.aggregate([
  {$group: {_id: "$author", bookCount: {$sum: 1} } },
  {$sort: {bookCount: -1}},
  {$limit: 1}
]);

// Implement a pipeline that groups books by publication decade and counts them
db.books.aggregate([
  {$group: {_id: {$subtract: ["$published_year", {$mod: ["$published_year", 10]}]},BooksInDecade: {$sum: 1}}},
  {$sort: {_id:1}}
]);

// TASK 5 INDEXING 
// Creating an index on "title"
db.books.createIndex({title: 1});

// creating a compound index
db.books.createIndexes([{author: 1}, {published_year: 1}]);

// demonstrating how find with indexes is easier
db.books.find({title: "Dune"}).explain();
db.books.find({author: "George Orwell", published_year: 1949}).explain();

// the output below demonstrates how the index already sorted simplifed the process of finding the search of the title "Dune"
// {
//   explainVersion: '1',
//   queryPlanner: {
//     namespace: 'plp_bookstore.books',
//     parsedQuery: {
//       title: {
//         '$eq': 'Dune'
//       }
//     },
//     indexFilterSet: false,
//     queryHash: '79F2D0D9',
//     planCacheShapeHash: '79F2D0D9',
//     planCacheKey: 'E03CA69C',
//     optimizationTimeMillis: 0,
//     maxIndexedOrSolutionsReached: false,
//     maxIndexedAndSolutionsReached: false,
//     maxScansToExplodeReached: false,
//     prunedSimilarIndexes: false,
//     winningPlan: {
//       isCached: false,
//       stage: 'FETCH',
//       inputStage: {
//         stage: 'IXSCAN',
//         keyPattern: {
//           title: 1
//         },
//         indexName: 'title_1',
//         isMultiKey: false,
//         multiKeyPaths: {
//           title: []
//         },
//         isUnique: false,
//         isSparse: false,
//         isPartial: false,
//         indexVersion: 2,
//         direction: 'forward',
//         indexBounds: {
//           title: [
//             '["Dune", "Dune"]'
//           ]
//         }
//       }
//     },
//     rejectedPlans: []
//   },
//   queryShapeHash: 'B6C1D6F79AAA979584A9BA83C2F8D87C839BED87CAE10CD5F0AE5B89BCE86C6B',
//   command: {
//     find: 'books',
//     filter: {
//       title: 'Dune'
//     },
//     '$db': 'plp_bookstore'
//   },
//   serverInfo: {
//     host: 'kieti-G5',
//     port: 27017,
//     version: '8.0.9',
//     gitVersion: 'f882ef816d531ecfbb593843e4c554fda90ca416'
//   },
//   serverParameters: {
//     internalQueryFacetBufferSizeBytes: 104857600,
//     internalQueryFacetMaxOutputDocSizeBytes: 104857600,
//     internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
//     internalDocumentSourceGroupMaxMemoryBytes: 104857600,
//     internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
//     internalQueryProhibitBlockingMergeOnMongoS: 0,
//     internalQueryMaxAddToSetBytes: 104857600,
//     internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
//     internalQueryFrameworkControl: 'trySbeRestricted',
//     internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
//   },
//   ok: 1
// }