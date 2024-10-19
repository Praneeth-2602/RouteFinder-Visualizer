export class Queue<T> {
    private items: T[] = [];

    // Enqueue an item at the back of the queue
    enqueue(item: T): void {
        this.items.push(item);
    }

    // Dequeue an item from the front of the queue
    dequeue(): T | undefined {
        return this.items.shift();
    }

    // Check if the queue is empty
    isEmpty(): boolean {
        return this.items.length === 0;
    }

    // Peek at the front item without removing it
    peek(): T | undefined {
        return this.items[0];
    }

    // Get the size of the queue
    size(): number {
        return this.items.length;
    }

    // Clear the queue
    clear(): void {
        this.items = [];
    }
}
