

const generateButton = document.getElementById("generate-btn");
const imagePromptInput = document.getElementById("image-prompt");
const lightGalleryContainer = document.getElementById("lightgallery");

generateButton.addEventListener("click", async () => {
  const prompt = imagePromptInput.value;

  if (prompt.length < 15) {
    alert("Prompt must be at least 15 characters!");
    return;
  }

  generateButton.textContent = "Generating...";
  generateButton.classList.add("opacity-75");
  generateButton.classList.add("pointer-events-none");

  // Generate the audio prompt using the backend
  const audioPrompt = await generateAudioPromptFromBackend(prompt);

  if (!audioPrompt) {
    alert("Error generating audio prompt.");
    return;
  }

  let generatedImages = [];
  let previousImageContext = prompt; // Start with the initial prompt

  // Generate images sequentially by hitting the backend 3 times
  for (let i = 0; i < 6; i++) {
    const newPrompt = await generateNextPrompt(previousImageContext);

    const image = await generateImagesFromBackend(previousImageContext);
    if (image.length > 0) {
      generatedImages.push(image[0]); // Assuming one image per request
      previousImageContext = newPrompt; // Add the new image context for the next round
    }
  }

  // Proceed to generate sound using the generated audio prompt
  generateAudio(audioPrompt);

  if (generatedImages.length === 0) {
    alert("Error generating images.");
    return;
  }

  generateButton.textContent = "Generate";
  generateButton.classList.remove("opacity-75");
  generateButton.classList.remove("pointer-events-none");
  imagePromptInput.value = "";

  // Clear existing images in the LightGallery
  lightGalleryContainer.innerHTML = "";

  // Loop through the generated images and add them to the LightGallery
  generatedImages.forEach((imageUrl) => {
    const imgElement = document.createElement("a");
    imgElement.href = imageUrl; // URL of the generated image

    const imageElement = document.createElement("img");
    imageElement.src = imageUrl; // Set the image source to the generated image URL
    imageElement.alt = imagePromptInput.value; // Add alt text

    imgElement.appendChild(imageElement); // Append the image to the link element
    lightGalleryContainer.appendChild(imgElement); // Append the link to the LightGallery container
  });

  // Re-initialize LightGallery after images are added
  lightGallery(document.getElementById("lightgallery"), {
    speed: 500,
    plugins: [],
    licenseKey: "your_license_key", // Make sure to include your license key here if required
  });

  lightGalleryContainer.scrollIntoView(); // Scroll to gallery after images are loaded
});

// Function to generate the audio prompt from the backend
async function generateAudioPromptFromBackend(imagePrompt) {
  try {
    const response = await fetch(
      `/generate-audio-prompt?text=${encodeURIComponent(imagePrompt)}`
    );

    if (response.ok) {
      const data = await response.json();
      return data.audioPrompt; // The generated audio prompt from the backend
    } else {
      console.error("Error generating audio prompt");
      return null;
    }
  } catch (error) {
    console.error("Error connecting to the backend:", error);
    return null;
  }
}

// Function to generate sound from the backend
async function generateAudio(text) {
  if (text) {
    try {
      // Fetch the generated sound from the backend using the generated audio prompt
      const response = await fetch(
        `/generate-sound?text=${encodeURIComponent(text)}`
      );

      if (response.ok) {
        // Create a Blob from the response data and generate a URL for the audio
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        // Set the audio player source to the generated sound
        const audioPlayer = document.getElementById("audioPlayer");
        audioPlayer.src = audioUrl;
        audioPlayer.play(); // Automatically play the audio
      } else {
        alert("Error generating sound effect");
      }
    } catch (error) {
      console.error("Error fetching sound:", error);
      alert("Error fetching sound");
    }
  } else {
    alert("Please enter text for sound");
  }
}

async function generateNextPrompt(previousContext) {
  try {
    const response = await fetch(
      `/generate-next-prompt?context=${encodeURIComponent(previousContext)}`
    );

    if (response.ok) {
      const data = await response.json();
      return data.nextPrompt; // The generated next prompt from the backend
    } else {
      console.error("Error generating next prompt");
      return previousContext; // Fallback to previous context if something goes wrong
    }
  } catch (error) {
    console.error("Error connecting to the backend:", error);
    return previousContext;
  }
}

// Function to generate images via the backend
async function generateImagesFromBackend(imagePrompt) {
  try {
    const response = await fetch(
      `/generate-images?text=${encodeURIComponent(imagePrompt)}`
    );

    if (response.ok) {
      const data = await response.json();
      return data.imageUrls; // The generated image URLs from the backend
    } else {
      console.error("Error generating images");
      return [];
    }
  } catch (error) {
    console.error("Error connecting to the backend:", error);
    return [];
  }
}
