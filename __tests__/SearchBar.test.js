import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "@/components/SearchBar";

describe("SearchBar", () => {
    it("renders correctly with default state", () => {
        render(<SearchBar onSearch={() => { }} isLoading={false} />);

        expect(screen.getByPlaceholderText("Enter IMDb ID (e.g. tt0133093)")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Search" })).toBeDisabled(); // Disabled initially because query is empty
    });

    it("enables search button when input is provided", () => {
        render(<SearchBar onSearch={() => { }} isLoading={false} />);

        const input = screen.getByPlaceholderText("Enter IMDb ID (e.g. tt0133093)");
        fireEvent.change(input, { target: { value: "tt0133093" } });

        const searchButton = screen.getByRole("button", { name: "Search" });
        expect(searchButton).not.toBeDisabled();
    });

    it("calls onSearch with correct query when submitted", () => {
        const mockOnSearch = jest.fn();
        render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

        const input = screen.getByPlaceholderText("Enter IMDb ID (e.g. tt0133093)");
        fireEvent.change(input, { target: { value: "tt0468569 " } }); // includes trailing space to test trim

        const form = input.closest("form");
        fireEvent.submit(form);

        expect(mockOnSearch).toHaveBeenCalledTimes(1);
        expect(mockOnSearch).toHaveBeenCalledWith("tt0468569");
    });

    it("disables input and shows loading state when isLoading is true", () => {
        render(<SearchBar onSearch={() => { }} isLoading={true} />);

        const input = screen.getByPlaceholderText("Enter IMDb ID (e.g. tt0133093)");
        expect(input).toBeDisabled();

        const searchButton = screen.getByRole("button", { name: "Searching..." });
        expect(searchButton).toBeDisabled();
        expect(searchButton).toBeInTheDocument();
    });
});
