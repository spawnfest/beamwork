defmodule SpotlightWeb.PageLive do
  use SpotlightWeb, :live_view
  alias DogSketch.SimpleDog

  @impl true
  def mount(_params, _session, socket) do
    socket =
      socket
      |> assign(quantile_data: formatted_time_series())
      |> assign(:pause_action, "Pause")
      |> assign(:refresh_rate, 1000)

    schedule_tick(socket)

    {:ok, socket}
  end

  @impl true
  def handle_event("toggle_pause", _value, socket) do
    new_state =
      if is_paused?(socket) do
        schedule_tick(socket)
        "Pause"
      else
        "Resume"
      end

    {:noreply, assign(socket, :pause_action, new_state)}
  end

  @impl true
  def handle_event("refresh_rate_change", %{"rate" => val}, socket) do
    {val_int, _} = Integer.parse(val)
    {:noreply, assign(socket, :refresh_rate, val_int)}
  end

  @impl true
  def handle_info(:tick, socket) do
    unless is_paused?(socket) do
      schedule_tick(socket)
    end

    {:noreply, assign(socket, :quantile_data, formatted_time_series())}
  end

  defp is_paused?(socket) do
    case socket.assigns.pause_action do
      "Pause" ->
        false

      "Resume" ->
        true
    end
  end

  defp schedule_tick(socket) do
    Process.send_after(self(), :tick, socket.assigns.refresh_rate)
  end

  defp formatted_time_series() do
    data = Spotlight.RequestTimeCollector.get_merged()
    keys = Enum.map(data, fn {ts, _} -> ts end)
    min_ts = Enum.min(keys, fn -> 0 end)
    max_ts = Enum.max(keys, fn -> 0 end)

    keys = Enum.map(min_ts..max_ts, fn x -> x end)

    [
      keys,
      Enum.map(keys, fn ts ->
        val = Map.get(data, ts, SimpleDog.new()) |> SimpleDog.quantile(0.99) |> ceil()
        val / 1000
      end),
      Enum.map(keys, fn ts ->
        val = Map.get(data, ts, SimpleDog.new()) |> SimpleDog.quantile(0.90) |> ceil()
        val / 1000
      end),
      Enum.map(keys, fn ts ->
        val = Map.get(data, ts, SimpleDog.new()) |> SimpleDog.quantile(0.50) |> ceil()
        val / 1000
      end),
      Enum.map(keys, fn ts ->
        Map.get(data, ts, SimpleDog.new()) |> SimpleDog.count() |> ceil()
      end)
    ]
  end
end
