const render = (res, path) => res.status(200).render(path)

exports.renderRoot = (req, res) => {
  render(res, 'root')
}
