const timelineContainer = document.getElementById('timeline');
const eventDetail = document.getElementById('event-detail');
const eventTitle = document.getElementById('event-title');
const eventDescription = document.getElementById('event-description');
const eventImage = document.getElementById('event-image');
const tooltip = document.getElementById('tooltip');

// Fetch events from the JSON file
fetch('data/events.json')
  .then(response => response.json())
  .then(events => {
    console.log('Events loaded:', events); // Log loaded events for debugging
    events.forEach((event, index) => createMarker(event, index)); // Create markers for each event
    drawConnectingLine(events.length); // Draw the connecting line after markers are created
  })
  .catch(error => console.error("Error loading events:", error));

// Create markers on the timeline
function createMarker(event, index) {
  const marker = document.createElement('div');
  marker.classList.add('marker');
  marker.title = event.year;
  marker.dataset.index = index;

  // Alternate classes for zigzag effect with diagonal placement
  if (index % 2 === 0) {
    marker.classList.add('left');
  } else {
    marker.classList.add('right');
  }

  // Position the marker based on the index for vertical alignment
  marker.style.top = `${index * 80 + 50}px`; // Adjust the vertical spacing and starting position

  // When a marker is clicked, show event details
  marker.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevents closing when clicking on the marker itself
    showEventDetails(event);
  });

  // Show tooltip on marker hover
  marker.addEventListener('mouseover', (e) => {
    tooltip.innerHTML = `<strong>${event.title}</strong><br>${event.year}`;
    tooltip.style.left = `${e.pageX + 10}px`;
    tooltip.style.top = `${e.pageY + 10}px`;
    tooltip.style.display = 'block';
  });

  marker.addEventListener('mouseout', () => {
    tooltip.style.display = 'none';
  });

  console.log(`Marker created for year: ${event.year} at position: ${index * 80 + 50}px`); // Add this line

  timelineContainer.appendChild(marker);
}

// Draw the connecting line in a zigzag pattern
function drawConnectingLine(markerCount) {
  const svg = document.getElementById('zigzag-lines');
  svg.innerHTML = ''; // Clear any existing lines

  const markers = document.querySelectorAll('.marker');

  for (let i = 0; i < markerCount - 1; i++) {
    const marker1 = markers[i];
    const marker2 = markers[i + 1];

    const x1 = marker1.classList.contains('left') ? marker1.offsetLeft + marker1.offsetWidth / 2 : marker1.offsetLeft + marker1.offsetWidth / 2;
    const y1 = marker1.offsetTop + marker1.offsetHeight / 2;
    const x2 = marker2.classList.contains('left') ? marker2.offsetLeft + marker2.offsetWidth / 2 : marker2.offsetLeft + marker2.offsetWidth / 2;
    const y2 = marker2.offsetTop + marker2.offsetHeight / 2;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.classList.add('zigzag-line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);

    svg.appendChild(line);
  }
}

// Show event details on marker click
function showEventDetails(event) {
  eventTitle.textContent = event.title;
  eventDescription.textContent = event.description;

  // Set the image source dynamically
  eventImage.src = `data/assets/images/${encodeURIComponent(event.image)}`;

  // Show the event detail modal
  eventDetail.classList.add('show');
}

// Close event details when clicking anywhere on the screen
eventDetail.addEventListener('click', (e) => {
  if (e.target === eventDetail) { // Click outside the modal content (background)
    eventDetail.classList.remove('show');
  }
});
// app.js

document.addEventListener('DOMContentLoaded', () => {
  // Load the event data from the JSON file
  fetch('event.json')
    .then(response => response.json())
    .then(events => {
      // Create the timeline and markers dynamically
      const timeline = document.getElementById('timeline');
      const zigzagLines = document.getElementById('zigzag-lines');
      const tooltip = document.getElementById('tooltip');
      const eventDetail = document.getElementById('event-detail');
      const eventTitle = document.getElementById('event-title');
      const eventDescription = document.getElementById('event-description');
      const eventImage = document.getElementById('event-image');

      events.forEach((event, index) => {
        const marker = document.createElement('div');
        marker.classList.add('marker');
        marker.dataset.index = index; // Store index for event identification

        // Calculate position for the marker based on the event year
        const year = parseInt(event.year);
        const position = ((year - 1979) / (2016 - 1979)) * 100; // Normalize to a percentage of the timeline width
        marker.style.left = `${position}%`;

        // Create the zigzag line for each event
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', `${position}%`);
        line.setAttribute('y1', 0);
        line.setAttribute('x2', `${position}%`);
        line.setAttribute('y2', '100%');
        line.setAttribute('class', 'zigzag-line');
        zigzagLines.appendChild(line);

        // Append the marker to the timeline
        timeline.appendChild(marker);

        // Add event listener to show event details when marker is clicked
        marker.addEventListener('click', () => {
          eventTitle.textContent = event.title;
          eventDescription.textContent = event.description;
          eventImage.src = event.image;
          eventImage.alt = event.title;

          // Display event details
          eventDetail.classList.add('show');
          gsap.from(eventDetail, { opacity: 0, duration: 0.6 });

          // Optionally, scroll to event on timeline
          timeline.scrollTo({
            top: marker.offsetTop - 200, // Adjust for better view
            behavior: 'smooth',
          });
        });

        // Show tooltip on marker hover
        marker.addEventListener('mouseenter', () => {
          tooltip.textContent = event.title;
          tooltip.style.display = 'block';
          tooltip.style.left = `${marker.offsetLeft + marker.offsetWidth / 2 - tooltip.offsetWidth / 2}px`;
          tooltip.style.top = `${marker.offsetTop - tooltip.offsetHeight - 10}px`;
        });

        marker.addEventListener('mouseleave', () => {
          tooltip.style.display = 'none';
        });
      });

      // Hide event details when clicked outside
      eventDetail.addEventListener('click', (e) => {
        if (e.target === eventDetail) {
          eventDetail.classList.remove('show');
        }
      });
    })
    .catch(err => console.error('Error loading event data:', err));
});

