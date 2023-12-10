/* eslint-disable */

const locations = JSON.parse(document.getElementById('map').dataset.locations)

export const displayMap = locations => {
  const accessToken = 'pk.eyJ1IjoiYmFyY2RldnMiLCJhIjoiY2xwemM5dmFhMWFjMzJrcDlnYzVkYWtsZiJ9.V4jl2N7a41-340lVIMgTow'

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/barcdevs/clpzccu2c008701pj3zfhdd90',
    scrollZoom: false
  })

  const bounds = new mapboxgl.LngLatBounds()

  locations.forEach(loc => {
    const el = document.createElement('div')
    el.className = 'marker'

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map)

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map)

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates)
  })

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  })
}
