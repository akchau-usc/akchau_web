// Diary entries data
const diaryEntries = {
    'sunny-nap': {
        title: '☀️ my new sun spot',
        date: 'may 10, 2025',
        content: `meow meow,  
today was absolutely purr-fect. mom got me a new cat tower and i'm able to sunbathe all day long while looking outside and keeping guard of the neighboorhood. the sun was so warm and i was so cozy all day. 

the humans kept walking by and i think they were saying how cute i look. i can't wait to rule my kingdom again tomorrow.

meow meow,
zizi 💤`
    },
    
    'treat-adventure': {
        title: '🐟 tuna surprise!',
        date: 'june 8, 2025',
        content: `meow meow,
My humans opened not one, but TWO cans of tuna! I could smell it from three rooms away and came running so fast I almost slipped on the kitchen tiles (but I played it off cool, obviously).
They put some in my special bowl and I devoured it in approximately 2.5 seconds. 
talk to you to-meow-row,
zizi 🐟`
    },
    
    'bird-watching': {
        title: '🐦 bird tv day',
        date: 'july 13, 2025',
        content: `Dear Diary,
Today I watched the most entertaining show ever - Bird TV! (That's what I call the view from the big window)
There were at least 12 different birds today. He had the audacity to eat from MY bird feeder (okay, technically it's the humans' bird feeder, but I'm the one who watches it all day, so clearly it's mine).
I made sure to give him some very stern looks through the window. He ignored me completely. The disrespect!

meeoooow,
zizi 🐦`
    },
    
    'toy-discovery': {
        title: '🧶 new toy alert!',
        date: 'august 2, 2025',
        content: `Dear Diary,
BREAKING NEWS: The humans brought home the most amazing thing ever - a feather wand toy!
At first, I was suspicious. Where did this mysterious feather come from? Why does it dance in the air like magic? Is it friend or foe?
The feather proved to be a worthy opponent, but after an epic 20-minute battle, I emerged victorious. 

meow meow,
zizi fifi`
    },
    
    'midnight-zoomies': {
        title: '🌙 midnight madness',
        date: 'august 29, 2025',
        content: `Dear Diary,
Last night at exactly 3:17 AM, I was struck by a sudden and urgent need... THE ZOOMIES!
I'm not sure what triggered it. Maybe it was the way the moonlight hit the hallway, or perhaps I suddenly remembered something very important I needed to do. Either way, it was ZOOM TIME!
The humans made some very interesting noises during my performance. I think they were cheering, though it sounded a bit like groaning? Maybe they were just impressed by my athletic abilities.

mwah mwah meow,
zizi`
    },
    
    'cuddle-session': {
        title: '🤗 best cuddles ever',
        date: 'september 28, 2025',
        content: `Dear Diary,
Today I provided my human with premium lap-warming services while they worked on their computer.
I gracefully positioned myself directly on their keyboard (because clearly that's where I belong), but they gently relocated me to their lap. I suppose that was acceptable.
For 2 glorious hours, I was the perfect purring accessory. 

mwah meow,
zinnie 💕`
    }
};

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    const journalBook = document.getElementById('journalBook');
    
    // Animate journal opening after a short delay
    setTimeout(() => {
        openJournal();
    }, 1500);
});

function openJournal() {
    const bookCover = document.querySelector('.book-cover');
    const bookPages = document.querySelector('.book-pages');
    
    // Add opening animation
    bookCover.classList.add('opened');
    
    // Show pages after cover animation
    setTimeout(() => {
        bookPages.classList.add('visible');
    }, 800);
}

function openEntry(entryId) {
    const modal = document.getElementById('entryModal');
    const entryContent = document.getElementById('entryContent');
    const entry = diaryEntries[entryId];
    
    if (entry) {
        entryContent.innerHTML = `
            <h3>${entry.title}</h3>
            <div class="entry-full-date">${entry.date}</div>
            <div class="entry-text">${entry.content.replace(/\n/g, '<br><br>')}</div>
        `;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeEntry() {
    const modal = document.getElementById('entryModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('entryModal');
    if (event.target === modal) {
        closeEntry();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeEntry();
    }
});

// No need for book opening/closing functionality with notepad design