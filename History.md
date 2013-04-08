
0.0.1 / 2013-04-14
==================

  * Fixed issue when creating a new category, the sidebar wasn't getting the new category id for the link
  * Now actually using local store to persist and reload data. Slightly better seed data.
  * Fixed some misc issues; saving new categories.
  * DIRTY: First stab at create new category with modal, etc...work in progress.
  * Fixes issue with the cells resizing all over the place.
  * Populating the Categories in the task table dynamically.
  * Added a create task partial; cleaned up selectCategory to use data attribute instead of nasty href split.
  * Added checkboxes along left side of each record. Only enabling the Delete button if one is checked. Also, got rid of edit button as we'll probably go with an inline edit for that.
  * Split out sidebar and content specs and added some more tests.
  * Added router. Added sidebar onCategorySelected logic. Added logic to show only tasks for selected category. Fixed broken tests. (note to self - need to add tests).
  * Just scaffolding out the UI and adjusting some tests that broke as a result.
  * Checking in a sample sandbox for experiments.
  * Fixed tests and refactored a bit.
  * Fixed conflicts.
  * Categories, Tasks, Task, Category (collections and models) + tests added.
  * Video 4 - bootstrapping the application. added sinonjs tests, jshintrc, etc.
  * Video 3 Backbone Model tests, etc., youtube 48S1WV0LNVU
  * Created some tests for Contacts
  * Create README.md
  * Added some silly backbone tests and got stuff configured a bit better.
  * First commit
