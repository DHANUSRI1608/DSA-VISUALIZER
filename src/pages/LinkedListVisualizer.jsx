function LinkedListVisualizer() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/visualizer" element={<Visualizer />} />
      <Route path="/visualizer/:dsId" element={<DataStructureVisualizer />} />
    </Routes>
  );
}

export default LinkedListVisualizer;
