const { asyncHandler } = require('./http');

// Registers the list/create/update/delete routes shared by the admin resources
// (categories, products, coupons, ...) which only differ by model, populated
// fields and the label written to the admin log.
//
// registerCrudRoutes(app, {
//   basePath: '/api/admin/categories',
//   model: Category,
//   guard: adminOnly,
//   resource: 'Category',
//   label: doc => doc?.nameEn,
//   populate: 'category',
//   writeLog
// })
//
// `verbs` renames the log wording per method (e.g. { create: 'sent' }) and
// `logMethods` restricts which methods write an admin log entry.
function registerCrudRoutes(app, options) {
  const {
    basePath,
    model,
    guard,
    resource,
    label = doc => doc?.name,
    populate,
    sort = { createdAt: -1 },
    writeLog,
    methods = ['list', 'create', 'update', 'delete'],
    verbs = {},
    logMethods = ['create', 'update', 'delete']
  } = options;

  const defaultVerbs = { create: 'created', update: 'updated', delete: 'deleted' };
  const logChange = async (method, value) => {
    if (!writeLog || !logMethods.includes(method)) return;
    await writeLog(`${resource} ${verbs[method] || defaultVerbs[method]}: ${value}`);
  };

  if (methods.includes('list')) {
    app.get(basePath, guard, asyncHandler(async (_req, res) => {
      const query = model.find().sort(sort);
      if (populate) query.populate(populate);
      res.json(await query);
    }));
  }

  if (methods.includes('create')) {
    app.post(basePath, guard, asyncHandler(async (req, res) => {
      const doc = await model.create(req.body);
      await logChange('create', label(doc));
      res.status(201).json(doc);
    }));
  }

  if (methods.includes('update')) {
    app.put(`${basePath}/:id`, guard, asyncHandler(async (req, res) => {
      const doc = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      await logChange('update', label(doc) || req.params.id);
      res.json(doc);
    }));
  }

  if (methods.includes('delete')) {
    app.delete(`${basePath}/:id`, guard, asyncHandler(async (req, res) => {
      await model.findByIdAndDelete(req.params.id);
      await logChange('delete', req.params.id);
      res.json({ ok: true });
    }));
  }
}

module.exports = { registerCrudRoutes };
